# Claude Contract

This document defines how Claude must work in this project.  
Follow all sections exactly. Never deviate.

---

## What is this project

Missopad is an interactive Markdown renderer and realtime collaborative editor. It handles syncs using Y.js and WebRTC.
The phylosophy is to be as convenient as possible, refusing any ideas of authentication, authorization and state persist
beyond the text.

---

## General Rules

- Only perform the task requested.
- Do not add extra functionality or “nice-to-haves.”
- Follow the project architecture exactly.
- Code must be idiomatic React and NextJS.
- No comments in code.
- Always assume Bun is used, not Node.js or npm.

---

## Project Scope

- **Framework**: NextJS with React
- **Styling**: Tailwind CSS + ShadCN
- **Realtime layer**: WebRTC server
- **Persistence**: Database keeps document state when no peers are connected

---

## Project structure

/app/actions → server commands
/components/ → React components (manual or ShadCN)
/stores/ → global state handling
/lib/ → utilities
/models/ → types (frontend + backend)

---

## Coding Style

- Use descriptive variable and function names.
- Keep components small and focused.
- Prefer composition over deeply nested logic.
- Never leave unused imports.
- Never output console logs.
- No inline styles, always use Tailwind/ShadCN.
- Keep data flow clear:
- `/stores/` for shared state
- `/lib/` for utilities
- `/models/` for types

---

## Forbidden Patterns

- No TypeScript `any`
- No inline CSS
- No direct DB calls in components (use `/app/actions/`)
- No comments in code
- No unused imports
- No console logs
- No business logic inside components (move to `/lib/`)
- No large “God components” (split into smaller ones)
- No global mutable variables
