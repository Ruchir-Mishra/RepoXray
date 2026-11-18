
// ============================================
// RepoXray — Shared GitHub Authentication UI
// Used by Home, About and User Guide
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
    const githubButton = document.getElementById("github-button");
    const githubDialog = document.getElementById("github-dialog");
    const signInLink = githubDialog?.querySelector(".dialog-action");

    // Preserve the page the user started login from.
    if (signInLink) {
        const returnTo = window.location.pathname;

        signInLink.href =
            `/auth/github?returnTo=${encodeURIComponent(returnTo)}`;

        signInLink.removeAttribute("target");
        signInLink.removeAttribute("rel");
    }

    if (!githubButton) return;

    try {
        // Ask the backend whether a GitHub user is logged in.
        const response = await fetch("/api/auth/user", {
            credentials: "same-origin",
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Could not check authentication status.");
        }

        const data = await response.json();

        if (!data.authenticated || !data.user) {
            return;
        }

        const user = data.user;

        // Create the authenticated profile display.
        const profileContainer = document.createElement("div");
        profileContainer.className = "github-profile-container";

        const profileLink = document.createElement("a");
        profileLink.className = "github-profile-link";
        profileLink.href = user.profileUrl;
        profileLink.target = "_blank";
        profileLink.rel = "noopener noreferrer";
        profileLink.setAttribute(
            "aria-label",
            `Open GitHub profile for ${user.login}`
        );

        const avatar = document.createElement("img");
        avatar.className = "github-profile-avatar";
        avatar.src = user.avatarUrl;
        avatar.alt = "";
        avatar.referrerPolicy = "no-referrer";

        const details = document.createElement("span");
        details.className = "github-profile-details";

        const displayName = document.createElement("strong");
        displayName.className = "github-profile-name";
        displayName.textContent = user.name || user.login;

        const username = document.createElement("span");
        username.className = "github-profile-username";
        username.textContent = `@${user.login}`;

        details.append(displayName, username);
        profileLink.append(avatar, details);

        // Logout button
        const logoutButton = document.createElement("button");
        logoutButton.className = "github-logout-button";
        logoutButton.type = "button";
        logoutButton.textContent = "Log out";
        logoutButton.setAttribute("aria-label", "Log out of RepoXray");

        logoutButton.addEventListener("click", async () => {
            logoutButton.disabled = true;
            logoutButton.textContent = "Logging out...";

            try {
                const logoutResponse = await fetch("/auth/logout", {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!logoutResponse.ok) {
                    throw new Error("Logout failed.");
                }

                window.location.reload();

            } catch (error) {
                console.error("Logout error:", error);
                logoutButton.disabled = false;
                logoutButton.textContent = "Log out";
                alert("Could not log out. Please try again.");
            }
        });

        profileContainer.append(profileLink, logoutButton);

        // Replace the original GitHub button.
        githubButton.replaceWith(profileContainer);

    } catch (error) {
        console.error("GitHub profile loading error:", error);
    }
});
