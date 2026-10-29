// ============================================
// RepoXray — Dashboard Interactions
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // 1. GitHub Modal
    // ========================================

    const githubButton = document.getElementById("github-button");
    const githubDialog = document.getElementById("github-dialog");
    const closeDialogButton = document.getElementById("dialog-close");

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

        // Close when clicking outside the modal.
        githubDialog.addEventListener("click", (event) => {
            if (event.target === githubDialog) {
                githubDialog.close();
            }
        });

        // Restore keyboard focus after closing.
        githubDialog.addEventListener("close", () => {
            githubButton?.focus();
        });
    }


    // ========================================
    // 2. Read the Selected Repository URL
    // ========================================

    const repositoryName = document.getElementById("repository-name");
    const repositoryDescription =
        document.getElementById("repository-description");

    const repositoryLink = document.getElementById("view-repository");
    const analysisStatus = document.getElementById("analysis-status");
    const analysisTime = document.getElementById("analysis-time");

    function getRepositoryFromUrl(value) {

        try {
            const url = new URL(value);

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

            const name = originalName.replace(/\.git$/i, "");

            if (!name || name === "." || name === "..") {
                return null;
            }

            return {
                owner,
                name,
                url: `https://github.com/${owner}/${name}`
            };

        } catch {
            return null;
        }
    }

    const queryParams = new URLSearchParams(window.location.search);
    const submittedRepository = queryParams.get("repo");

    if (submittedRepository) {

        const repository = getRepositoryFromUrl(submittedRepository);

        if (repository) {

            if (repositoryName) {
                repositoryName.textContent =
                    `${repository.owner} / ${repository.name}`;
            }

            if (repositoryDescription) {
                repositoryDescription.textContent =
                    "Repository selected for analysis.";
            }

            if (repositoryLink) {
                repositoryLink.href = repository.url;
                repositoryLink.hidden = false;
            }

            if (analysisStatus) {
                analysisStatus.textContent = "Repository selected";
            }

            if (analysisTime) {
                analysisTime.textContent = "Preview data";
            }

            // Keep the dashboard's preview-data notice visible.
        }
    }


    // ========================================
    // 3. Activity Chart — Time-Period Selector
    // ========================================

    const periodSelector = document.getElementById("activity-period");

    const chartLine = document.querySelector(".chart-line");
    const chartArea = document.querySelector(".chart-area");
    const chartPoints = document.querySelector(".chart-points");

    const chartMonths = document.getElementById("chart-months");

    /*
       These are illustrative demo series, not actual
       GitHub activity measurements.
    */

    const sampleChartData = {

        "3": {
            labels: ["Jul", "Aug", "Sep"],
            values: [35, 52, 43, 67, 59, 82]
        },

        "6": {
            labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            values: [
                15, 30, 23, 51, 39, 63, 48,
                35, 58, 47, 76, 63, 88
            ]
        },

        "12": {
            labels: [
                "Nov", "Dec", "Jan", "Feb",
                "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct"
            ],
            values: [
                18, 26, 22, 38, 31, 45,
                39, 55, 49, 68, 61, 84
            ]
        }

    };

    function updateActivityChart(period) {

        const data = sampleChartData[period];

        if (!data || !chartLine || !chartArea || !chartPoints) {
            return;
        }

        const width = 720;
        const baseline = 200;

        const left = 8;
        const right = width - 8;

        const availableWidth = right - left;

        const points = data.values.map((value, index) => {

            const x =
                left +
                (index / (data.values.length - 1)) * availableWidth;

            const y = baseline - value * 1.65;

            return {
                x,
                y
            };
        });

        const lineCoordinates = points
            .map((point) => (
                `${point.x.toFixed(1)},${point.y.toFixed(1)}`
            ))
            .join(" ");

        chartLine.setAttribute("points", lineCoordinates);

        const areaPath = [
            `M ${points[0].x} ${baseline}`,
            ...points.map((point) => (
                `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
            )),
            `L ${points[points.length - 1].x} ${baseline}`,
            "Z"
        ].join(" ");

        chartArea.setAttribute("d", areaPath);

        chartPoints.replaceChildren();

        points.forEach((point) => {

            const circle = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

            circle.setAttribute("cx", point.x.toFixed(1));
            circle.setAttribute("cy", point.y.toFixed(1));
            circle.setAttribute("r", "3");

            chartPoints.appendChild(circle);
        });

        if (chartMonths) {

            chartMonths.replaceChildren();

            data.labels.forEach((label) => {

                const span = document.createElement("span");

                span.textContent = label;

                chartMonths.appendChild(span);
            });
        }
    }

    if (periodSelector) {

        periodSelector.addEventListener("change", () => {
            updateActivityChart(periodSelector.value);
        });

        // Draw the initial illustrative series.
        updateActivityChart(periodSelector.value);
    }


    // ========================================
    // 4. View All Contributors
    // ========================================

    const contributorsButton =
        document.getElementById("view-contributors");

    const additionalContributors =
        document.getElementById("additional-contributors");

    const sampleAdditionalContributors = [
        {
            name: "Contributor Delta",
            initial: "D",
            count: 188
        },
        {
            name: "Contributor Epsilon",
            initial: "E",
            count: 142
        }
    ];

    function renderAdditionalContributors() {

        if (!additionalContributors) {
            return;
        }

        additionalContributors.replaceChildren();

        sampleAdditionalContributors.forEach((contributor) => {

            const row = document.createElement("div");
            row.className = "contributor-row";

            const avatar = document.createElement("span");
            avatar.className = "contributor-avatar";
            avatar.textContent = contributor.initial;

            const information = document.createElement("div");
            information.className = "contributor-information";

            const name = document.createElement("h3");
            name.textContent = contributor.name;

            const description = document.createElement("p");
            description.textContent = "Example contributor";

            information.append(name, description);

            const count = document.createElement("span");
            count.className = "contribution-count";
            count.textContent = contributor.count.toLocaleString();

            row.append(avatar, information, count);

            additionalContributors.appendChild(row);
        });

        const notice = document.createElement("p");

        notice.className = "sample-data-note";
        notice.textContent =
            "These are illustrative entries, not fetched GitHub contributors.";

        additionalContributors.appendChild(notice);
    }

    if (contributorsButton && additionalContributors) {

        contributorsButton.addEventListener("click", () => {

            const currentlyExpanded =
                contributorsButton.getAttribute("aria-expanded") === "true";

            if (currentlyExpanded) {

                additionalContributors.hidden = true;

                contributorsButton.setAttribute("aria-expanded", "false");

                contributorsButton.innerHTML =
                    'View all contributors <span aria-hidden="true">→</span>';

            } else {

                renderAdditionalContributors();

                additionalContributors.hidden = false;

                contributorsButton.setAttribute("aria-expanded", "true");

                contributorsButton.innerHTML =
                    'Show fewer contributors <span aria-hidden="true">↑</span>';
            }
        });
    }


    // ========================================
    // 5. Expand Repository Structure Rows
    // ========================================

    const structureList =
        document.getElementById("repository-structure-list");

    if (structureList) {

        const structureRows =
            structureList.querySelectorAll(".structure-row");

        structureRows.forEach((row) => {

            row.addEventListener("click", () => {

                const details = row.nextElementSibling;

                if (
                    !details ||
                    !details.classList.contains("structure-details")
                ) {
                    return;
                }

                const isExpanded =
                    row.getAttribute("aria-expanded") === "true";

                row.setAttribute(
                    "aria-expanded",
                    String(!isExpanded)
                );

                details.hidden = isExpanded;
            });
        });
    }

});