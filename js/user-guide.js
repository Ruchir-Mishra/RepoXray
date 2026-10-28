// =============================================
// RepoXray — User Guide Interactions
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    // Main elements
    const guideLayout = document.querySelector(".guide-layout");

    const sidebar = document.getElementById("guide-sidebar");
    const sidebarToggle = document.getElementById("guide-sidebar-toggle");
    const sidebarBackdrop = document.getElementById("guide-backdrop");

    const sidebarLinks = document.querySelectorAll(".guide-nav-link");
    const guideSections = document.querySelectorAll(".guide-section");

    // Copy button elements
    const copyButton = document.getElementById("copy-example");
    const copyButtonText = document.getElementById("copy-button-text");
    const exampleUrl = document.getElementById("example-repository-url");

    // GitHub dialog elements
    const githubButton = document.getElementById("github-button");
    const githubDialog = document.getElementById("github-dialog");
    const closeDialogButton = document.getElementById("dialog-close");


    // =============================================
    // 1. Floating Notifications
    // =============================================

    let toastTimer;

    function showToast(message, type = "success") {
        let toast = document.getElementById("guide-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "guide-toast";
            toast.className = "guide-toast";

            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");

            document.body.appendChild(toast);
        }

        clearTimeout(toastTimer);

        toast.className = `guide-toast ${type}`;
        toast.replaceChildren();

        const icon = document.createElement("span");
        icon.className = "toast-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = type === "success" ? "✓" : "!";
        
        const text = document.createElement("span");
        text.className = "toast-message";
        text.textContent = message;

        toast.append(icon, text);

        // Trigger the entrance animation.
        requestAnimationFrame(() => {
            toast.classList.add("visible");
        });

        toastTimer = setTimeout(() => {
            toast.classList.remove("visible");
        }, 3200);
    }


    // =============================================
    // 2. Sidebar Drawer
    // =============================================

    function openSidebar() {
        if (!guideLayout || !sidebarToggle) return;

        guideLayout.classList.add("sidebar-open");

        sidebarToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("guide-drawer-open");
    }

    function closeSidebar(returnFocus = false) {
        if (!guideLayout || !sidebarToggle) return;

        guideLayout.classList.remove("sidebar-open");

        sidebarToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("guide-drawer-open");

        if (returnFocus) {
            sidebarToggle.focus();
        }
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            const isOpen =
                guideLayout?.classList.contains("sidebar-open");

            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener("click", () => {
            closeSidebar(true);
        });
    }


    // =============================================
    // 3. Sidebar Navigation
    // =============================================

    function setActiveSection(sectionId) {
        sidebarLinks.forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            // Update the selected navigation item immediately.
            setActiveSection(target.id);

            // Update the URL hash without jumping abruptly.
            history.replaceState(null, "", targetId);

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            // Close the drawer after selecting a section.
            closeSidebar();

            // Move keyboard focus to the destination section.
            target.setAttribute("tabindex", "-1");

            window.setTimeout(() => {
                target.focus({
                    preventScroll: true
                });
            }, 250);
        });
    });


    // =============================================
    // 4. Highlight the Section Being Viewed
    // =============================================

    function findCurrentSection() {
        if (!guideSections.length) return;

        const marker = window.innerHeight * 0.35;

        let currentSection = guideSections[0];

        guideSections.forEach((section) => {
            const rect = section.getBoundingClientRect();

            if (rect.top <= marker) {
                currentSection = section;
            }
        });

        setActiveSection(currentSection.id);
    }

    let scrollScheduled = false;

    window.addEventListener("scroll", () => {
        if (scrollScheduled) return;

        scrollScheduled = true;

        requestAnimationFrame(() => {
            findCurrentSection();
            scrollScheduled = false;
        });
    }, { passive: true });

    // Activate a section directly linked in the URL.
    const initialHash = window.location.hash;

    if (
        initialHash &&
        document.querySelector(initialHash)?.classList.contains("guide-section")
    ) {
        setActiveSection(initialHash.slice(1));
    } else {
        findCurrentSection();
    }


    // =============================================
    // 5. Copy Example Repository URL
    // =============================================

    async function copyText(text) {
        // Preferred approach for HTTPS or localhost.
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        // Fallback for older browsers or local development.
        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = text;
        temporaryInput.setAttribute("readonly", "");

        temporaryInput.style.position = "absolute";
        temporaryInput.style.left = "-9999px";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();
        temporaryInput.setSelectionRange(0, text.length);

        let copied = false;

        try {
            copied = document.execCommand("copy");
        } finally {
            temporaryInput.remove();
        }

        if (!copied) {
            throw new Error("Copy operation was unsuccessful.");
        }
    }

    if (copyButton && exampleUrl) {
        copyButton.addEventListener("click", async () => {
            const text = exampleUrl.textContent.trim();

            const originalText = "Copy";

            copyButton.disabled = true;

            try {
                await copyText(text);

                if (copyButtonText) {
                    copyButtonText.textContent = "Copied!";
                }

                copyButton.classList.add("copied");

                showToast(
                    "Repository URL copied to clipboard.",
                    "success"
                );
            } catch (error) {
                console.error("Could not copy repository URL:", error);

                showToast(
                    "Couldn't copy automatically. Select the URL and copy it manually.",
                    "error"
                );
            } finally {
                window.setTimeout(() => {
                    if (copyButtonText) {
                        copyButtonText.textContent = originalText;
                    }

                    copyButton.classList.remove("copied");
                    copyButton.disabled = false;
                }, 1800);
            }
        });
    }


    // =============================================
    // 6. GitHub Modal
    // =============================================

    if (githubButton && githubDialog) {
        githubButton.addEventListener("click", () => {
            if (!githubDialog.open) {
                githubDialog.showModal();
            }
        });
    }

    if (closeDialogButton && githubDialog) {
        closeDialogButton.addEventListener("click", () => {
            githubDialog.close();
        });
    }

    if (githubDialog) {
        // Clicking the backdrop closes the dialog.
        githubDialog.addEventListener("click", (event) => {
            if (event.target === githubDialog) {
                githubDialog.close();
            }
        });

        // Return focus to the GitHub button when the dialog closes.
        githubDialog.addEventListener("close", () => {
            githubButton?.focus();
        });
    }


    // =============================================
    // 7. Keyboard Behaviour
    // =============================================

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const drawerIsOpen =
                guideLayout?.classList.contains("sidebar-open");

            if (drawerIsOpen) {
                closeSidebar(true);
            }

            // The native HTML dialog handles Escape itself.
        }
    });

    // Keep the sidebar closed when moving back to desktop width.
    const desktopMedia = window.matchMedia("(min-width: 951px)");

    desktopMedia.addEventListener("change", (event) => {
        if (event.matches) {
            closeSidebar();
        }
    });
});