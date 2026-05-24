# Book Repo — Project Guidelines

## Architecture

Monorepo with two main projects:

- **`client/`** — Next.js 14 (App Router) with TypeScript, Tailwind CSS, Auth0, and SWR for data fetching
- **`server/`** — ASP.NET Core 8 Minimal API with Entity Framework Core, MediatR (CQRS), SQL Server, and Auth0 JWT auth

The client consumes the server via an auto-generated TypeScript client (`server-client.d.ts`) built from the server's OpenAPI spec. The server uses a CQRS pattern where commands contain their own execution logic rather than separate handler classes.

## Code Style — Client (TypeScript / React)

- **Functional components only** — no class components
- **Named exports** for all components and hooks — no default exports except Next.js pages (which use `withPageAuthRequired`)
- **Props type** defined as `type Props = { ... }` directly above the component, destructured in params
- **Tailwind CSS** for all styling — no CSS modules or styled-components
- **class-variance-authority (CVA)** for conditional/variant styling
- **SWR** for all data fetching hooks with consistent config: `refreshInterval: 60000`, `revalidateOnFocus: false`, custom `onErrorRetry` that returns early on 404
- **Barrel exports** via `index.ts` in each module folder (`components/`, `hooks/`, `services/`, `lib/`)
- **Path alias** `@/*` for absolute imports from the project root
- **`"use client"`** directive at the top of pages/components that use hooks or browser APIs
- Constants use `SCREAMING_SNAKE_CASE`
- Hook names start with `use` prefix: `useGetBook`, `useSearchForBooks`
- Session storage via `useSessionStorage` for wizard/multi-step flows
- Pure functional transformations with spread operators for immutability in utility functions
- External design system: `@jecfe/react-design-system` (provides `Button`, `Anchor`, `Spinner`, etc.)

### SWR Hook Pattern

All data-fetching hooks follow this exact shape:

```typescript
import { getApiClient } from "@/services";
import useSWR from "swr";

const getX = getApiClient().path("/route/{param}").method("get").create();

export const useGetX = (param?: string) => {
  const key = param ? `getX/${param}` : undefined;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => (await getX({ param: param as string })).data,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      onErrorRetry: (error) => {
        if (error.status === 404) return;
      },
    },
  );
  return { data, error, isLoading, mutate };
};
```

### Service Pattern

Mutation services are single-line exports — no wrapper functions:

```typescript
import { getApiClient } from ".";

export const updateRanking = getApiClient()
  .path("/action/rate-customer-book")
  .method("post")
  .create();
```

### API Client

`getApiClient()` in `services/getApiClient.ts` creates a typed `openapi-typescript-fetch` client with two middleware layers: `addAuth()` (fetches a bearer token from `/api/protected`) and `addBaseUrl()` (prepends the server base URL).

### Pages with Auth

Next.js pages that require a logged-in user are wrapped with `withPageAuthRequired` from `@auth0/nextjs-auth0/client`:

```typescript
export default withPageAuthRequired(function PageName({ user }) { ... });
```

## Code Style — Server (C# / .NET)

- **File-scoped namespaces** — single `namespace X;` at top, no braces
- **Minimal API** with static router classes using extension methods on `RouteGroupBuilder`
- **`Results<Ok<T>, NotFound, ...>`** union return types on all route handlers
- **CQRS via MediatR** — commands implement `ICommand<BookRepoContext>` with an `Execute` method containing the logic (no separate handler classes; a generic `CommandHandler` dispatches them)
- **Events** via `INotification` / `INotificationHandler` for side effects (e.g. trophy awarding); published through `ctx.Publish(...)` inside `Execute`
- **Domain models** use `record` types with `required` + `init` properties and `= []` default collections
- **Sealed records** for polymorphic subtypes (e.g. `Trophy` hierarchy)
- **Primary constructors** for DI in providers and handlers: `public class BookshelfProvider(BookRepoContext context)`
- **Interface-based DI** for providers (`IBookshelfProvider`, `ICustomerProvider`)
- **LINQ query syntax** preferred for complex queries, method syntax for simple ones
- **`is not { }` pattern** for null checks: `if (await ... is not { } result)`
- **Custom exceptions** (`NotFoundException`, `InvalidUserException`) caught in route handlers or the shared `CommandExecutor` and mapped to HTTP results
- **`CancellationToken`** threaded through all async methods
- **`DateTimeOffset`** for all date/time values — use `ctx.Time.GetUtcNow()` inside commands (not `DateTimeOffset.UtcNow` directly)
- **Nullable reference types** enabled project-wide

### Route Handler Pattern

Route handlers are private static methods on a static router class. Always verify user identity with `IUserContext` before dispatching to MediatR:

```csharp
private static async Task<Results<NoContent, ForbidHttpResult>> AddBookshelf(
    AddBookshelfCommand command,
    IMediator mediator,
    IUserContext userContext,
    CancellationToken cancellationToken
)
{
    var userId = userContext.UserId;
    if (userId is not { } || command.Id != userId)
    {
        return TypedResults.Forbid();
    }
    await mediator.Send(command, cancellationToken);
    return TypedResults.NoContent();
}
```

The `MapX` method wires all handlers on a `RouteGroupBuilder` and sets a Swagger tag:

```csharp
public static RouteGroupBuilder MapBookshelfEndpoints(this RouteGroupBuilder group)
{
    group.WithTags("Bookshelf");
    group.MapGet("/{bookshelfId}", GetBookshelf);
    return group;
}
```

### Command Pattern

Commands embed their own logic in `Execute`. They receive a `CommandContext` (wraps `IPublisher`, `TimeProvider`, and the caller's username) rather than injecting services directly:

```csharp
public class AddBookshelfCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public required List<string> Bookshelves { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        // EF + business logic here
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
```

To raise a domain event from a command: `await ctx.Publish(new SomeEvent(...), cancellationToken);`

To return a value, implement `ICommand<BookRepoContext, TResult>` and change `Execute` to `Task<TResult>`.

### Exception → HTTP Mapping

Throw custom exceptions inside commands; catch them in the route handler (or `CommandExecutor.Execute` for the standard `Ok / BadRequest / Forbid` shape):

| Exception                      | HTTP result                   |
| ------------------------------ | ----------------------------- |
| `NotFoundException` / subclass | `400 BadRequest` with message |
| `InvalidUserException`         | `403 Forbid`                  |

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

- API client is generated from `server/Server.Tests/_snapshots/api-spec.json` — regenerate after server API changes with `npm run build:client` in `client/`
- The server's `appsettings.development.json` sets `migrateDB: true` so EF migrations run on startup in dev
- All API routes require authorization; grouped by domain (`/customer`, `/action`, `/bookshelf`, `/book`, `/shareable`, `/admin`)
- Admin routes use `.RequireAuthorization(Permission.BookRepoAdmin)` and are on their own Swagger doc (`admin`)
- Services in the client are thin wrappers around the generated API client with middleware for auth tokens and base URL
- Auth0 is the auth provider for both client and server
- Providers (`BookshelfProvider`, `CustomerProvider`) handle read-side queries; commands handle writes
- Two Swagger docs are served: `v1` (self-serve routes) and `admin`
