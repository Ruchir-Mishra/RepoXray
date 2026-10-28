// ============================================
// RepoXray — About Page Interactions
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // GitHub modal elements
    const githubButton = document.getElementById("github-button");
    const githubDialog = document.getElementById("github-dialog");
    const closeDialogButton = document.getElementById("dialog-close");


    // ========================================
    // 1. Open GitHub Modal
    // ========================================

    if (githubButton && githubDialog) {

        githubButton.addEventListener("click", () => {

            // Open the modal only if it is currently closed.
            if (!githubDialog.open) {
                githubDialog.showModal();
            }

        });

    }


    // ========================================
    // 2. Close Modal Using the X Button
    // ========================================

    if (closeDialogButton && githubDialog) {

        closeDialogButton.addEventListener("click", () => {

            if (githubDialog.open) {
                githubDialog.close();
            }

        });

    }


    // ========================================
    // 3. Close Modal by Clicking Outside
    // ========================================

    if (githubDialog) {

        githubDialog.addEventListener("click", (event) => {

            // Clicking the dialog backdrop closes the modal.
            if (event.target === githubDialog) {
                githubDialog.close();
            }

        });


        // ====================================
        // 4. Return Focus After Closing
        // ====================================

        githubDialog.addEventListener("close", () => {

            if (githubButton) {
                githubButton.focus();
            }

        });

    }

});