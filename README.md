# Repo X-Ray

## Project Overview

Repo X-Ray is a web-based repository inspection and health analysis platform designed for developers and engineering teams. The application provides an instant, centralized dashboard to analyze source code repositories without requiring complex local terminal setups or disparate diagnostic tools.

By connecting a repository, users can evaluate code structure, track development activity, inspect commit histories, and visualize direct and transitive package dependencies through an interactive interface.

---

## Key Features

The platform provides comprehensive repository analysis across seven primary feature modules:

1. **Repo Summary**: Displays essential repository metadata including repository name, owner, primary language, star and fork counts, license type, and repository size.
2. **Active Pull Requests**: Tracks open pull requests, titles, author details, target branches, and update timestamps.
3. **Contributors**: Visualizes contributor lists, individual commit counts, and overall contribution distribution.
4. **Commits**: Presents chronological commit logs, author information, commit messages, and specific file modifications.
5. **Code Frequency**: Displays metrics and visual graphs representing weekly code additions and deletions over time.
6. **Dependency Graph**: Generates an interactive visual tree mapping direct and transitive package dependencies extracted from manifest files.
7. **Activity Feed**: Compiles a timeline of repository events, including recent merges, releases, and issue updates.

---

## Repository Import Methods

Repo X-Ray supports three distinct methods for repository analysis:

* **Public GitHub Repository URL**: Paste any standard public GitHub repository link to fetch live data via the GitHub REST API.
* **ZIP Archive Upload**: Upload a local repository as a `.zip` file for extracted local manifest parsing and analysis.
* **GitHub OAuth Connection**: Authenticate using GitHub OAuth to select and inspect public repositories directly from a synchronized list.

---

## Data Security & Privacy

Repo X-Ray processes repository files strictly within isolated, temporary server storage during active analysis sessions. Uploaded ZIP archives and extracted source code files are automatically purged immediately following data extraction to prevent unauthorized storage or exposure of repository code.

---

## License

This project is maintained for academic and educational purposes under the CSE2022 Web Programming course curriculum.


## System Architecture & Workflow

```text
+-------------------------------------------------------------------+
|                        USER INPUT METHODS                         |
|  +-------------------+   +-----------------+   +---------------+  |
|  | GitHub Public URL |   | ZIP File Upload |   | GitHub OAuth  |  |
|  +---------+---------+   +--------+--------+   +-------+-------+  |
+------------|----------------------|--------------------|----------+
             |                      |                    |
             v                      v                    v
+-------------------------------------------------------------------+
|                      EXPRESS.JS BACKEND ROUTER                    |
|  +-------------------+   +-----------------+   +---------------+  |
|  | GitHub API Module |   | Multer Parser   |   | OAuth Module  |  |
|  +---------+---------+   +--------+--------+   +-------+-------+  |
+------------|----------------------|--------------------|----------+
             |                      |                    |
             +------------------+   |   +----------------+
                                |   |   |
                                v   v   v
+-------------------------------------------------------------------+
|                      DATA PROCESSING ENGINE                       |
|  +-------------------------------------------------------------+  |
|  |  1. Metadata Aggregation (Stars, Forks, Language, License)  |  |
|  |  2. Activity Processing (Commits, PRs, Code Frequency)      |  |
|  |  3. Manifest Parsing (package.json / Dependency Mapping)    |  |
|  +------------------------------+------------------------------+  |
+---------------------------------|---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     TEMPORARY CLEANUP & RESPONSE                  |
|  * Purge extracted ZIP files / Temporary server memory            |
|  * Formulate Unified JSON Response Structure                      |
+---------------------------------|---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                       FRONTEND DASHBOARD (UI)                     |
|  * Render Repo Summary, Commits, PRs, Contributors & Activity     |
|  * Render Interactive Dependency Tree Visualization               |
+-------------------------------------------------------------------+
---

---

