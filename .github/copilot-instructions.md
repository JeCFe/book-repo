# Book Repo — Project Guidelines

## Architecture

Monorepo with two main projects:

- **`client/`** — Next.js 14 (App Router) with TypeScript, Tailwind CSS, Auth0, and SWR for data fetching
- **`server/`** — ASP.NET Core 8 Minimal API with Entity Framework Core, MediatR (CQRS), SQL Server, and Auth0 JWT auth

The client consumes the server via an auto-generated TypeScript client (`server-client.d.ts`) built from the server's OpenAPI spec. The server uses a CQRS pattern where commands contain their own execution logic rather than separate handler classes.

## Code Style — Client (TypeScript / React)

- **Functional components only** — no class components
- **Named exports** for all components and hooks — no default exports except Next.js pages
- **Props type** defined as `type Props = { ... }` directly above the component, destructured in params
- **Tailwind CSS** for all styling — no CSS modules or styled-components
- **class-variance-authority (CVA)** for conditional/variant styling
- **SWR** for all data fetching hooks with consistent config: `refreshInterval: 60000`, `revalidateOnFocus: false`, custom `onErrorRetry` skipping 404s
- **Barrel exports** via `index.ts` in each module folder (`components/`, `hooks/`, `services/`, `lib/`)
- **Path alias** `@/*` for absolute imports from the project root
- **`"use client"`** directive on pages/components that need client-side features
- Constants use `SCREAMING_SNAKE_CASE`
- Hook names start with `use` prefix: `useGetBook`, `useSearchForBooks`
- Session storage via `useSessionStorage` for wizard/multi-step flows
- Pure functional transformations with spread operators for immutability in utility functions
- External design system: `@jecfe/react-design-system`

## Code Style — Server (C# / .NET)

- **File-scoped namespaces** — single `namespace X;` at top, no braces
- **Minimal API** with static router classes using extension methods on `RouteGroupBuilder`
- **`Results<Ok<T>, NotFound, ...>`** union return types on all route handlers
- **CQRS via MediatR** — commands implement `ICommand<TDbContext>` with an `Execute` method containing the logic (no separate handler classes; a generic `CommandHandler` dispatches them)
- **Events** via `INotification` / `INotificationHandler` for side effects (e.g. trophy awarding)
- **Domain models** use `record` types with `required` + `init` properties and `= []` default collections
- **Sealed records** for polymorphic subtypes (e.g. `Trophy` hierarchy)
- **Primary constructors** for DI in providers and handlers: `public class BookshelfProvider(BookRepoContext context)`
- **Interface-based DI** for providers (`IBookshelfProvider`, `ICustomerProvider`)
- **LINQ query syntax** preferred for complex queries, method syntax for simple ones
- **`is not { }` pattern** for null checks: `if (await ... is not { } result)`
- **Custom exceptions** (`NotFoundException`, `InvalidUserException`) caught in a shared `CommandExecutor` and mapped to HTTP results
- **`CancellationToken`** threaded through all async methods
- **`DateTimeOffset`** for all date/time values
- **Nullable reference types** enabled project-wide

## Build & Test

### Server

```bash
cd server
dotnet build
dotnet test
dotnet run --project Server           # starts on http://localhost:5247
dotnet ef database update --project Server.Domain --startup-project Server  # apply migrations
```

### Client

```bash
cd client
npm install                           # also runs build:client to generate TS client
npm run dev                           # starts on http://localhost:3000
npm test                              # Jest unit tests
npx cypress open                      # E2E tests
```

### Full Stack (Docker)

```bash
docker compose up --build
```

## Conventions

- API client is generated from `server/Server.Tests/_snapshots/api-spec.json` — regenerate after server API changes
- The server's `appsettings.development.json` sets `migrateDB: true` so EF migrations run on startup in dev
- All API routes require authorization; grouped by domain (`/customer`, `/action`, `/bookshelf`, `/book`, `/shareable`, `/admin`)
- Admin routes use `RequireAuthorization(Permission.BookRepoAdmin)`
- Services in the client are thin wrappers around the generated API client with middleware for auth tokens and base URL
- Auth0 is the auth provider for both client and server
