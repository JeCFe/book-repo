<div align="center">
<img width="200" alt="Book Repo logo" src="https://github.com/JeCFe/book-repo/assets/38367384/225023c4-8d80-4a84-9a88-18402563fa19">
</div>

# The Book Repository

A service to allow for the visualisation and management of you physical bookshelf in the digital world. Persistant user storage and secure user accounts with Auth0 being the authentication provider. Deploying to Azure Container Registries / Apps, using OpenLibrary public APIs for inital data injection when searching for book. Caching the book data onto Azure SQL Server and the book covers onto Azure Blob Storage.

## Features

- Ability to create and manage user account (following GDPR principles)
- Create and manage numourous bookshelves
- Add books to these bookshelves with unique ordering per shelf
- Ability to add books by ISBN and fuzzy searching
- Allow to rate books
- Allow to add comments onto books
- Trophy / achievements that display on user profiles

## Roadmap

- Shareable uneditable links to bookshelves / account
- Favourite / "Wish list" book from a shareable link
- Allow importing library from Good Read
- Set reading goals
- Be able to see a global catalogue of book other customers use with averaged reviews and anonymous reviews
- Add books into a series and filter by series
- Add different filtering per bookshelf
- AI driven book recommendations based of what's in your bookshelf or what has been recently read
- Be able to raise errors with the book data / cover
- Admin portal to allow the management of users and errors raised about books
- Split out the user self service into a dedicated service and app so it's reusable by other apps in the future
- ~~Trophy / achievements that display on user profiles~~, and are shareable on the shared pages

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Docker](https://www.docker.com/) (for the database, or for running the full stack)

### Running with Docker Compose

The easiest way to run the full stack is with Docker Compose. You'll need to build the projects first and supply environment variables.

1. Build the server:

```bash
cd server
dotnet publish -c Release
cd ..
```

2. Build the client:

```bash
cd client
npm install
npm run build
cd ..
```

3. Create a `.env` file in the project root with your Auth0 and service configuration:

```env
# Server
Auth0__Domain=<your-auth0-domain>
Auth0__ClientId=<your-auth0-client-id>
Auth0__ClientSecret=<your-auth0-client-secret>
Auth0__Audience=<your-auth0-audience>

# Client
AUTH0_SECRET=<a-random-secret>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://<your-auth0-domain>
AUTH0_CLIENT_ID=<your-auth0-client-id>
AUTH0_CLIENT_SECRET=<your-auth0-client-secret>
BASE_URL=http://localhost:5247
```

4. Start everything:

```bash
docker compose up --build
```

This will start:

- **SQL Server** (Azure SQL Edge) on port `1433`
- **Server** (.NET API) on port `5247` — migrations run automatically (`migrateDB=true`)
- **Client** (Next.js) on port `3000`

---

### Running Locally (without Docker)

#### Database

Start the SQL Server database using Docker:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Th1sI5&Str0ngPa44w0rd" -p 1433:1433 -d mcr.microsoft.com/azure-sql-edge
```

#### Server

1. Navigate to the server directory:

```bash
cd server
```

2. Apply database migrations using the EF Core CLI:

```bash
dotnet tool install --global dotnet-ef  # if not already installed
dotnet ef database update --project Server.Domain --startup-project Server
```

3. Run the server:

```bash
dotnet run --project Server
```

The server will start on `http://localhost:5247` by default. Swagger UI is available at `/swagger`.

> **Note:** The development config (`appsettings.development.json`) has `migrateDB` set to `true`, so migrations will also run automatically on startup when running in the development environment.

#### Client

1. Navigate to the client directory:

```bash
cd client
```

2. Create a `.env.local` file with the required environment variables:

```env
AUTH0_SECRET=<a-random-secret>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://<your-auth0-domain>
AUTH0_CLIENT_ID=<your-auth0-client-id>
AUTH0_CLIENT_SECRET=<your-auth0-client-secret>
BASE_URL=http://localhost:5247
```

3. Install dependencies and build the TypeScript API client:

```bash
npm install
```

> The `install` script automatically runs `build:client`, which generates a TypeScript client from the server's API spec (`server/Server.Tests/_snapshots/api-spec.json`).

4. Start the development server:

```bash
npm run dev
```

The client will be available at `http://localhost:3000`.

---

### Running Tests

#### Server Tests

```bash
cd server
dotnet test
```

#### Client Tests

```bash
cd client
npm test
```

#### Cypress E2E Tests

Create a `cypress.env.json` in the client directory:

```json
{
  "CYPRESS_USERNAME": "****",
  "CYPRESS_PASSWORD": "****",
  "CYPRESS_DOMAIN": "****"
}
```

Then run:

```bash
cd client
npx cypress open
```

---

## Third Party Providers

Azure -> used for deployments, SQL servers, and blob storage

Auth0 -> used as authentication provider

OpenLibrary -> used to get book data and book covers
