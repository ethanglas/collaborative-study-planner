# Collaborative Study Planner API

The server is a TypeScript and Express API for the Collaborative Study Planner.

## Requirements

* Node.js 22 or newer
* npm 10 or newer

## Installation

From the repository root:

```powershell
Set-Location .\server
npm install
Copy-Item .\.env.example .\.env
```

The `.env` file is used only for local configuration and must not be committed.

## Commands

| Command              | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start the TypeScript server in watch mode |
| `npm run build`      | Compile TypeScript into `dist`            |
| `npm start`          | Run the compiled server                   |
| `npm test`           | Run the automated tests once              |
| `npm run test:watch` | Rerun tests when files change             |

## Environment variables

| Variable        | Required | Default                 | Purpose                        |
| --------------- | -------: | ----------------------- | ------------------------------ |
| `PORT`          |       No | `4000`                  | Port used by the API           |
| `CLIENT_ORIGIN` |       No | `http://localhost:5173` | Browser origin allowed by CORS |

See `.env.example` for safe example values.

## Health endpoint

### `GET /api/health`

Confirms that the API process is available.

Successful response:

```json
{
  "status": "ok"
}
```

Expected status code: `200 OK`.

## Project structure

```text
server/
├── src/
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── health.test.ts
├── .env.example
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

`app.ts` configures and exports the Express application. `server.ts` loads environment variables and starts the network listener. Keeping these responsibilities separate allows automated tests to import the application without opening a port.

## Testing

Run:

```powershell
npm test
```

The health-endpoint test verifies the response status, content type, and JSON body.
