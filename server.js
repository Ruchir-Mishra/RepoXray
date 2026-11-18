
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const fs = require("node:fs/promises");
const path = require("node:path");
const {
    randomUUID,
    randomBytes,
    timingSafeEqual
} = require("node:crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// Project directories
const htmlDir = path.join(__dirname, "html");
const cssDir = path.join(__dirname, "css");
const jsDir = path.join(__dirname, "js");
const assetsDir = path.join(__dirname, "assets");

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "repositories.json");

// Parse incoming JSON requests
app.use(express.json({ limit: "10kb" }));

// Session configuration
app.use(session({
    name: "repoxray.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

// Serve project assets and pages
app.use("/css", express.static(cssDir));
app.use("/js", express.static(jsDir));
app.use("/assets", express.static(assetsDir));
app.use("/html", express.static(htmlDir));

// Open the Home page
app.get("/", (req, res) => {
    res.redirect("/html/home-page.html");
});

// ========================================
// 1. GITHUB AUTHENTICATION
// ========================================

// Start GitHub login
app.get("/auth/github", (req, res) => {
    const { GITHUB_CLIENT_ID, GITHUB_CALLBACK_URL } = process.env;

    if (!GITHUB_CLIENT_ID || !GITHUB_CALLBACK_URL ||
        !process.env.SESSION_SECRET) {
        return res.status(500).send("Authentication is not configured.");
    }

    const requestedPage = req.query.returnTo;

    const allowedPages = [
        "/html/home-page.html",
        "/html/about.html",
        "/html/user-guide.html"
    ];

    req.session.returnTo = allowedPages.includes(requestedPage)
        ? requestedPage
        : "/html/home-page.html";

    const state = randomBytes(32).toString("hex");
    req.session.oauthState = state;

    const authorizationURL = new URL(
        "https://github.com/login/oauth/authorize"
    );

    authorizationURL.searchParams.set("client_id", GITHUB_CLIENT_ID);
    authorizationURL.searchParams.set("redirect_uri", GITHUB_CALLBACK_URL);
    authorizationURL.searchParams.set("scope", "read:user");
    authorizationURL.searchParams.set("state", state);

    req.session.save((error) => {
        if (error) {
            console.error("Session save error:", error);
            return res.status(500).send("Could not start GitHub login.");
        }

        res.redirect(authorizationURL.toString());
    });
});

// GitHub sends the user back here
app.get("/auth/github/callback", async (req, res) => {
    try {
        if (req.query.error) {
            return res.redirect("/html/home-page.html");
        }

        const { code, state } = req.query;
        const expectedState = req.session.oauthState;
        const returnTo = req.session.returnTo ||
            "/html/home-page.html";

        if (!code || !state || !expectedState ||
            typeof state !== "string" ||
            typeof expectedState !== "string") {
            return res.status(400).send("Invalid OAuth request.");
        }

        const received = Buffer.from(state);
        const expected = Buffer.from(expectedState);

        if (received.length !== expected.length ||
            !timingSafeEqual(received, expected)) {
            return res.status(403).send("Invalid OAuth state.");
        }

        delete req.session.oauthState;
        delete req.session.returnTo;

        const {
            GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET,
            GITHUB_CALLBACK_URL
        } = process.env;

        if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET ||
            !GITHUB_CALLBACK_URL) {
            return res.status(500).send("GitHub credentials are missing.");
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: GITHUB_CLIENT_ID,
                    client_secret: GITHUB_CLIENT_SECRET,
                    code,
                    redirect_uri: GITHUB_CALLBACK_URL
                })
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || tokenData.error ||
            !tokenData.access_token) {
            console.error("GitHub token exchange failed:", tokenData.error);
            return res.status(401).send("GitHub authentication failed.");
        }

        // Fetch authenticated GitHub user's profile
        const profileResponse = await fetch(
            "https://api.github.com/user",
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${tokenData.access_token}`,
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }
        );

        if (!profileResponse.ok) {
            throw new Error("Could not retrieve GitHub profile.");
        }

        const githubUser = await profileResponse.json();

        const userProfile = {
            id: githubUser.id,
            login: githubUser.login,
            name: githubUser.name || githubUser.login,
            avatarUrl: githubUser.avatar_url,
            profileUrl: githubUser.html_url
        };

        // Regenerate session to prevent session fixation
        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        req.session.user = userProfile;

        await new Promise((resolve, reject) => {
            req.session.save((error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        res.redirect(returnTo);

    } catch (error) {
        console.error("GitHub authentication error:", error);
        res.status(500).send("Something went wrong during GitHub login.");
    }
});

// Get currently logged-in user's information
app.get("/api/auth/user", (req, res) => {
    if (!req.session.user) {
        return res.json({
            authenticated: false
        });
    }

    res.json({
        authenticated: true,
        user: req.session.user
    });
});

// Logout
app.post("/auth/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.status(500).json({
                error: "Could not log out."
            });
        }

        res.clearCookie("repoxray.sid", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        res.json({
            message: "Logged out successfully."
        });
    });
});

// ========================================
// 2. REPOSITORY URL VALIDATION
// ========================================

function parseRepositoryUrl(value) {
    if (typeof value !== "string" || value.length > 2048) {
        return null;
    }

    let url;

    try {
        url = new URL(value.trim());
    } catch {
        return null;
    }

    if (
        url.protocol !== "https:" ||
        url.hostname.toLowerCase() !== "github.com" ||
        url.port ||
        url.username ||
        url.password
    ) {
        return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length !== 2) {
        return null;
    }

    const [owner, originalName] = parts;

    if (
        !/^[A-Za-z0-9-]+$/.test(owner) ||
        !/^[A-Za-z0-9._-]+$/.test(originalName)
    ) {
        return null;
    }

    const repositoryName = originalName.replace(/\.git$/i, "");

    if (!repositoryName || repositoryName === "." ||
        repositoryName === "..") {
        return null;
    }

    return {
        owner,
        repositoryName,
        repositoryUrl: `https://github.com/${owner}/${repositoryName}`
    };
}

// Read saved repository submissions
async function readRepositories() {
    const content = await fs.readFile(dataFile, "utf8");
    const records = JSON.parse(content);

    if (!Array.isArray(records)) {
        throw new Error("Repository data must be a JSON array.");
    }

    return records;
}

// GET API: fetch all saved submissions
app.get("/api/repositories", async (req, res) => {
    try {
        const records = await readRepositories();
        res.json(records);
    } catch (error) {
        console.error("Error reading repositories:", error);

        res.status(500).json({
            error: "Could not retrieve saved repositories."
        });
    }
});

// POST API: save a repository submission
app.post("/api/repositories", async (req, res) => {
    try {
        const repository = parseRepositoryUrl(
            req.body?.repositoryUrl
        );

        if (!repository) {
            return res.status(400).json({
                error: "Please enter a valid GitHub repository URL."
            });
        }

        const records = await readRepositories();

        const record = {
            id: randomUUID(),
            ...repository,
            submittedAt: new Date().toISOString()
        };

        records.push(record);

        await fs.writeFile(
            dataFile,
            JSON.stringify(records, null, 2) + "\n",
            "utf8"
        );

        res.status(201).json({
            message: "Repository submission saved successfully.",
            repository: record
        });

    } catch (error) {
        console.error("Error saving repository:", error);

        res.status(500).json({
            error: "The repository submission could not be saved."
        });
    }
});

// ========================================
// 3. START SERVER
// ========================================

async function startServer() {
    if (!process.env.SESSION_SECRET) {
        throw new Error("SESSION_SECRET is missing from .env");
    }

    await fs.mkdir(dataDir, { recursive: true });

    try {
        await fs.access(dataFile);
    } catch {
        await fs.writeFile(dataFile, "[]\n", "utf8");
    }

    app.listen(PORT, () => {
        console.log(`RepoXray running at http://localhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Could not start RepoXray:", error);
    process.exit(1);
});
