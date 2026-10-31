// ============================================
// RepoXray — Home Page Interactions
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // Form elements
    const repositoryForm =
        document.getElementById("repository-form");

    const repositoryInput =
        document.getElementById("repository-url");

    const formMessage =
        document.getElementById("form-message");


    // GitHub modal elements
    const githubButton =
        document.getElementById("github-button");

    const githubDialog =
        document.getElementById("github-dialog");

    const closeDialogButton =
        document.getElementById("dialog-close");


    // ========================================
    // 1. Display Form Messages
    // ========================================

    function showMessage(message, type = "") {

        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = "form-message";

        if (type) {
            formMessage.classList.add(type);
        }
    }


    // ========================================
    // 2. Validate GitHub Repository URL
    // ========================================

    function validateRepositoryUrl(value) {

        const input = value.trim();

        if (!input) {
            return {
                valid: false,
                message: "Please enter a GitHub repository URL."
            };
        }

        let parsedUrl;

        try {
            parsedUrl = new URL(input);
        } catch {
            return {
                valid: false,
                message: "Please enter a valid URL."
            };
        }

        if (
            parsedUrl.protocol !== "https:" ||
            parsedUrl.hostname.toLowerCase() !== "github.com" ||
            parsedUrl.port ||
            parsedUrl.username ||
            parsedUrl.password
        ) {
            return {
                valid: false,
                message: "Please enter a valid HTTPS GitHub URL."
            };
        }

        const parts = parsedUrl.pathname
            .split("/")
            .filter(Boolean);

        if (parts.length !== 2) {
            return {
                valid: false,
                message:
                    "Enter the main repository URL, not an issue, file, or pull request link."
            };
        }

        const [owner, originalName] = parts;

        if (
            !/^[A-Za-z0-9-]+$/.test(owner) ||
            !/^[A-Za-z0-9._-]+$/.test(originalName)
        ) {
            return {
                valid: false,
                message: "The repository URL format is incorrect."
            };
        }

        const repositoryName = originalName.replace(/\.git$/i, "");

        if (
            !repositoryName ||
            repositoryName === "." ||
            repositoryName === ".."
        ) {
            return {
                valid: false,
                message: "Please enter a valid repository name."
            };
        }

        return {
            valid: true,
            owner,
            repositoryName,
            url: `https://github.com/${owner}/${repositoryName}`
        };
    }


   // ========================================
// Repository Form Submission
// ========================================

if (repositoryForm && repositoryInput) {

    repositoryForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        // 1. Validate the submitted URL
        const result = validateRepositoryUrl(
            repositoryInput.value
        );

        if (!result.valid) {

            showMessage(result.message, "error");

            repositoryInput.setAttribute(
                "aria-invalid",
                "true"
            );

            repositoryInput.focus();

            return;
        }

        repositoryInput.removeAttribute("aria-invalid");

        // 2. Prepare the submit button
        const analyzeButton = repositoryForm.querySelector(
            ".analyze-button"
        );

        const originalButtonHTML = analyzeButton
            ? analyzeButton.innerHTML
            : "";

        if (analyzeButton) {
            analyzeButton.disabled = true;
            analyzeButton.textContent = "Saving...";
        }

        showMessage("Saving repository information...");

        try {

            // 3. Send the repository URL to Express
            const response = await fetch("/api/repositories", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    repositoryUrl: result.url
                })
            });

            const data = await response.json().catch(() => ({}));

            // 4. Handle server errors
            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Could not save the repository submission."
                );
            }

            // 5. Confirm successful saving
            showMessage(
                "Repository saved successfully. Opening dashboard...",
                "success"
            );

            // 6. Navigate to Dashboard with the submitted URL
            const dashboardUrl = new URL(
                "dashboard.html",
                window.location.href
            );

            dashboardUrl.searchParams.set(
                "repo",
                result.url
            );

            window.location.href = dashboardUrl.href;

        } catch (error) {

            console.error(
                "Repository submission failed:",
                error
            );

            showMessage(
                error.message ||
                "Unable to save the repository. Please try again.",
                "error"
            );

        } finally {

            if (analyzeButton) {
                analyzeButton.disabled = false;
                analyzeButton.innerHTML = originalButtonHTML;
            }

        }

    });


    // Clear validation errors when the input changes
    repositoryInput.addEventListener("input", () => {

        repositoryInput.removeAttribute("aria-invalid");

        showMessage("");

    });

}


    // ========================================
    // 4. Open GitHub Modal
    // ========================================

    if (githubButton && githubDialog) {

        githubButton.addEventListener("click", () => {

            if (!githubDialog.open) {
                githubDialog.showModal();
            }

        });

    }


    // ========================================
    // 5. Close GitHub Modal
    // ========================================

    if (closeDialogButton && githubDialog) {

        closeDialogButton.addEventListener("click", () => {
            githubDialog.close();
        });

    }


    // Close modal when clicking outside
    if (githubDialog) {

        githubDialog.addEventListener("click", (event) => {

            if (event.target === githubDialog) {
                githubDialog.close();
            }

        });

        // Restore focus after closing
        githubDialog.addEventListener("close", () => {

            githubButton?.focus();

        });

    }

});
