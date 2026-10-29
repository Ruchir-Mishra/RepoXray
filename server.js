const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

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

// Serve project assets and pages
app.use("/css", express.static(cssDir));
app.use("/js", express.static(jsDir));
app.use("/assets", express.static(assetsDir));
app.use("/html", express.static(htmlDir));

// Open the Home page at the root URL
app.get("/", (req, res) => {
    res.redirect("/html/home-page.html");
});

// Validate a GitHub repository URL
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

    if (!repositoryName || repositoryName === "." || repositoryName === "..") {
        return null;
    }

    return {
        owner,
        repositoryName,
        repositoryUrl:
            `https://github.com/${owner}/${repositoryName}`
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

// Initialize JSON storage and start the server
async function startServer() {
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