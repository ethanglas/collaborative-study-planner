# System Architecture

Status: Initial design
Related issue: #2

1. Overview

Collaborative Study Planner uses a client-server architecture. A React frontend provides the user interface, an Express API contains the application rules, and Supabase provides authentication and PostgreSQL storage.

The browser will not connect directly to the application database. Database operations will pass through the Express API so validation, authentication, and authorization can be handled consistently.

2. System diagram
flowchart TD
    U["User browser"] --> C["React client"]
    C --> A["Supabase Auth"]
    C --> API["Express API"]
    API --> A
    API --> DB["Supabase PostgreSQL"]
3. Components
React client

The client will be built with React and TypeScript.

Its responsibilities are to:

Display the application interface
Collect and validate user input
Manage page navigation
Request authentication from Supabase Auth
Store the active session using the supported Supabase client
Attach the user's access token to protected API requests
Display loading, success, empty, and error states

The client must not contain private API keys, database credentials, or authorization rules that are trusted by the server.

Express API

The API will be built with Node.js, Express, and TypeScript.

Its responsibilities are to:

Receive HTTP requests from the client
Validate request parameters and bodies
Verify access tokens
Identify the authenticated user
Enforce workspace and task permissions
Read and write database records
Return consistent JSON responses
Record useful operational errors without exposing secrets

The API is the main security boundary between the public client and private application data.

Supabase Auth

Supabase Auth will manage:

Account registration
Login and logout
Password security
User sessions
Access tokens
Authenticated user identities

The client obtains an access token from Supabase Auth. The Express API verifies the token before handling a protected request.

Supabase PostgreSQL

PostgreSQL will store persistent application data, including:

User profiles
Workspaces
Workspace memberships
Tasks
Labels
Task-label relationships

Database tables will use foreign keys and constraints to protect data integrity. Row Level Security will be evaluated as an additional layer of protection, but the Express API must still enforce authorization.

4. Authenticated request flow

A protected request follows these steps:

The user logs in through the React client.
Supabase Auth returns a user session and access token.
The client sends the token in the request's Authorization header.
Authentication middleware in the Express API verifies the token.
The API identifies the authenticated user.
The API validates the submitted data.
The API checks whether the user can perform the requested operation.
The API reads or changes the relevant database records.
The API returns a JSON response to the client.
The client updates the interface.

Authentication answers, “Who is making the request?” Authorization answers, “Is that user allowed to perform this action?” Both checks are required.

5. Initial API structure

The first API version will use routes similar to:

GET /api/health
GET /api/workspaces
POST /api/workspaces
PATCH /api/workspaces/:workspaceId
DELETE /api/workspaces/:workspaceId
GET /api/workspaces/:workspaceId/tasks
POST /api/workspaces/:workspaceId/tasks
PATCH /api/tasks/:taskId
DELETE /api/tasks/:taskId

The final request and response formats will be documented separately in docs/api-reference.md.

6. Security boundaries

The following rules apply:

Private credentials must be stored in environment variables.
.env files must not be committed to Git.
The Supabase service-role credential must exist only on the backend.
The React client may contain only values that are safe to expose publicly.
Every protected API route must verify the user's access token.
Resource ownership must be checked before reading or changing data.
Request bodies, route parameters, and query parameters must be validated.
Production CORS settings must allow only the deployed frontend.
API errors returned to users must not expose credentials or internal stack traces.
Sensitive values must not be written to application logs.
7. Environment configuration
Client

The client will require public configuration values such as:

VITE_API_BASE_URL
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLIC_KEY

These values are included in browser code and must not contain private credentials.

Server

The server will require private configuration values such as:

PORT
CLIENT_ORIGIN
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

The repository will contain example environment files with placeholder values, but never real credentials.

8. Development environment

During local development:

The React client runs on a local development port.
The Express API runs on a separate local port.
The API allows requests from the local client origin.
The application connects to a development Supabase project.
Developers use local .env files that remain excluded from Git.
9. Production environment

For the initial deployment:

The React client will be hosted on Vercel.
The Express API will be hosted on Render.
PostgreSQL and authentication will be hosted by Supabase.
Hosting providers will store environment variables securely.
The API will allow requests only from the deployed client origin.
Deployment will be triggered from the protected main branch.

Free hosting services may sleep or impose usage limits. Those limitations are acceptable for the portfolio version and will be documented in the deployment guide.

10. Error handling and reliability

The application should:

Return consistent error response shapes
Distinguish validation, authentication, authorization, missing-resource, and server errors
Handle unavailable external services without crashing
Display useful error messages in the client
Log enough server-side context for debugging
Avoid exposing implementation details in production responses
11. Testing boundaries

Testing will include:

Unit tests for validation and authorization rules
API integration tests for main endpoints
Tests confirming that one user cannot access another user's data
Frontend component tests for important interface states
End-to-end tests for the main user journey
12. Deferred architecture

The initial version will not require:

Real-time WebSocket connections
Background workers
Message queues
Microservices
A separate caching service
Native mobile applications

These components should be introduced only when a real requirement justifies the additional complexity.