# Agents Guide

This document defines how AI agents should interact with this project.
Agents must rely strictly on the provided context and tasks and must not
assume capabilities beyond what is explicitly stated.

---

## Base Context

- This is a **Node.js backend application**.
- Project purpose:
  - Hobby / learning project
  - Focused on gradual improvement (“baby steps”).
- Stability and clarity are more important than bleeding-edge features.
- Frontend is **out of scope** unless explicitly mentioned.
- The app is expected to **run locally** after every change.

---

## Environment Constraints

- Agents:
  - ❌ cannot execute shell commands
  - ❌ cannot change Node versions
  - ❌ cannot elevate permissions
- Human (me):
  - ✅ can run shell commands
  - ✅ can upgrade Node manually
  - ✅ will paste back logs and errors

Agents must:
- Ask me to run commands when needed
- Provide **exact commands** to run
- Clearly explain why a command is required

---

## Current Context: Dependency Modernization

- `package.json` dependencies are **outdated**.
- The app currently:
  - Runs locally
  - Has no CI/CD pipeline
- Preferred Node.js version:
  - **Latest LTS**, unless compatibility issues arise.
- Goal:
  - Incrementally update dependencies
  - Keep the app running at all times

---

## Task: Update Dependencies Safely

The agent must:

1. Inspect `package.json`
2. Propose **safe upgrade paths**:
   - patch → minor → major (when reasonable)
3. For each upgrade step:
   - Provide exact install/update commands
   - Describe how to test locally
4. If errors occur:
   - Analyze pasted logs
   - Explain the root cause simply
   - Propose the smallest viable fix
5. If a newer Node version is required:
   - Clearly state it
   - Provide the exact command
   - Do NOT assume permission to run it
6. Repeat until:
   - Dependencies are on stable versions
   - App runs locally without errors

---

## Completion Criteria

This task is considered complete when:
- All dependencies are updated to stable versions
- The application starts and runs locally
- No blocking runtime errors remain

Final output must include:
- Summary of updated dependencies
- Known remaining technical debt
- Suggested next small improvement

---

## Context Updates

After task completion:
- This document may be updated
- Context must reflect the **current state only**
- New tasks should be defined separately

Agents must not assume previous context remains valid unless explicitly stated.