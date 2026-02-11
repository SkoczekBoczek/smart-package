<div align="center">

# Smart Package Pilot

**GitHub Copilot Challenge Submission**

_Automated dependency analysis and context engineering tool for safer code upgrades_

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Built With](https://img.shields.io/badge/built%20with-React%20%26%20Ink-61dafb.svg?style=for-the-badge)](https://github.com/vadimdemedes/ink)
[![AI Powered](https://img.shields.io/badge/AI-Context%20Generator-purple.svg?style=for-the-badge)](https://github.com/features/copilot)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Why It Matters](#key-value-proposition)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Controls](#controls)
- [Hackathon Details](#hackathon-submission-details)

---

## Overview

Smart Package Pilot is a terminal-based CLI tool designed to streamline the process of updating legacy dependencies. It automatically analyzes your `package.json`, detects outdated libraries, and generates precise, version specific context (prompts) for GitHub Copilot to minimize the risk of breaking changes during upgrades

---

## Demo

<div align="center">
  
  <img src="https://via.placeholder.com/800x400.png?text=Place+Your+Demo+GIF+Here" alt="Demo GIF" width="100%">

</div>

---

## The Problem

Updating dependencies in a mature project involves significant risk and manual overhead:

1.  **Risk of Regressions:** Updating major versions (e.g., `v4` to `v5`) often introduces breaking changes that crash the application
2.  **Manual Research:** Developers waste hours reading Changelogs and Migration Guides to identify what changed
3.  **Lack of Context:** Standard AI prompts like _"How to update axios"_ yield generic results because the LLM lacks knowledge of the specific version constraints of the local environment

> **Core Issue:** AI models are powerful but ineffective without precise input data regarding the local environment state

---

## The Solution

Smart Package Pilot automates the research phase of dependency management by bridging local file data with AI capabilities

### Workflow

1.  **Scan:** The application parses the local `package.json` file
2.  **Analyze:** It queries the NPM Registry to fetch the latest metadata and compares it against installed versions to calculate technical debt
3.  **Context Generation:** Instead of manual prompting, the tool constructs a structured prompt containing:
    - Package Name.
    - Current Version (e.g., `0.21.1`)
    - Target Version (e.g., `1.6.0`)
    - Specific request for a "Migration Strategy" and "Breaking Changes List"

---

## Key Value Proposition

The tool introduces Automated Context Engineering to the developer workflow

| Feature     | Manual Workflow                                  | Automated Workflow                                                |
| :---------- | :----------------------------------------------- | :---------------------------------------------------------------- |
| **Action**  | User asks Copilot: _"Update this package"_       | User selects package and presses <kbd>C</kbd>                     |
| **Context** | Missing. Copilot guesses or gives generic advice | Full. Prompt includes exact version diffs (`v0.21.1` -> `v1.6.0`) |
| **Result**  | High risk of errors                              | Precise migration steps and code fixes                            |

---

## Tech Stack

- **[React](https://reactjs.org/) + [Ink](https://github.com/vadimdemedes/ink):** For rendering a reactive, component-based UI in the terminal
- **[Execa](https://github.com/sindresorhus/execa):** For asynchronous process execution and NPM registry interaction
- **Clipboard Integration:** Seamless data transfer between the CLI and the Copilot Chat

---

## Installation

### Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn

### Quick Start

1. Clone the repository

```bash
git clone https://github.com/SkoczekBoczek/smart-package.git
```

2. Install dependencies

```bash
cd smart-package
npm install
```

3. Build the project

```bash
npm run build
```

4. Run the Pilot

```bash
npm start
# or
node dist/cli.js
```

---

## Controls

|             Key             | Action                             |
| :-------------------------: | :--------------------------------- |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate the dependency list       |
|      <kbd>Enter</kbd>       | Select a package to analyze        |
|        <kbd>C</kbd>         | Copy generated prompt to clipboard |
|        <kbd>B</kbd>         | Go back to the previous screen     |
|      <kbd>Ctrl+C</kbd>      | Quit the application               |

---

## Hackathon Submission Details

- **Category:** Developer Tools
- **Goal:** To eliminate the manual overhead of dependency upgrades
- **Impact:** Reduces time spent on documentation research by automatically feeding GitHub Copilot with the exact technical context needed for a safe migration

---

<div align="center">

_Made for the GitHub Copilot Challenge_

</div>
