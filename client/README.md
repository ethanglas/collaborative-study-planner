# Collaborative Study Planner Client

The client is a React and TypeScript frontend for the Collaborative Study Planner. It is built with Vite and communicates with the Express API.

## Requirements

* Node.js 22 or newer
* npm 10 or newer
* The project API running locally for a successful connection status

## Installation

From the repository root:

```powershell
Set-Location .\client
npm install
Copy-Item .\.env.example .\.env
```

The `.env` file is for local configuration and must not be committed.

## Commands

| Command              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start the Vite development server          |
| `npm run build`      | Type-check and build the production client |
| `npm run preview`    | Preview the production build locally       |
| `npm run lint`       | Check the source code with Oxlint          |
| `npm test`           | Run the automated tests once               |
| `npm run test:watch` | Rerun tests when files change              |

## Environment variables

| Variable            | Required | Default                 | Purpose                     |
| ------------------- | -------: | ----------------------- | --------------------------- |
| `VITE_API_BASE_URL` |       No | `http://localhost:4000` | Base URL of the Express API |

Variables beginning with `VITE_` are included in browser code and must never contain private credentials.

## Current behavior

The initial client:

* Displays the Collaborative Study Planner landing page
* Requests `GET /api/health`
* Shows a checking state while the request is pending
* Shows an available state when the API responds successfully
* Shows an unavailable state when the API cannot be reached
* Adapts its layout for desktop and mobile widths

## Project structure

```text
client/
├── src/
│   ├── api/
│   │   └── health.ts
│   ├── test/
│   │   └── setup.ts
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── README.md
├── vite.config.ts
└── vitest.config.ts
```

## Testing

Run:

```powershell
npm test
```

The component tests cover the checking, availaable, and unavailable API states.
