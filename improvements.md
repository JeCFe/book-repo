# Codebase Improvements

## 🔴 Critical — Security

### 1. Secrets in a local config file with no example template
**File:** `server/Server/appsettings.development.json`

`appsettings.development.json` is correctly gitignored. However, there is no committed `appsettings.development.json.example` (or similar) to guide new developers on what values are needed. Without one, setting up a local environment requires out-of-band knowledge. Consider adding an example file with placeholder values and documenting it in the README.

```json
// appsettings.development.example.json
{
  "Auth0": { "Domain": "", "ClientId": "", "ClientSecret": "", "Audience": "" },
  "ConnectionStrings": { "db": "" },
  "Auth0Management": { "Domain": "", "ClientId": "", "ClientSecret": "", "GrantType": "client_credentials", "Audience": "" },
  "Blob": { "ConnectionString": "", "ContainerName": "" },
  "BetaTest": { "Enabled": "false" },
  "migrateDB": false
}
```

### 2. CORS is completely open
**File:** `server/Server/Program.cs`

The CORS policy allows any origin, method, and header. This should be locked down to the specific client origin(s).

```csharp
// Current — too permissive:
policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();

// Suggested:
policy.WithOrigins("https://your-client-domain.com")
      .AllowAnyMethod()
      .AllowAnyHeader();
```

---

## 🔴 Critical — Bugs

### 3. `isComplete` is always `true`
**File:** `client/hooks/addSetupWizard.ts`

The `complete` function returns `true` or `false` — never `null`. The subsequent `!= null` check is therefore always `true`, making `isComplete` useless as a guard.

```typescript
// Bug: false != null is true, so isComplete is always true
const completeNewRegistration = complete(newSetupCustomerData);
const isComplete = completeNewRegistration != null;

// Fix:
const isComplete = complete(newSetupCustomerData);
```

### 4. SWR cache key collision between two hooks
**Files:** `client/hooks/useGetBookshelfSummary.ts`, `client/hooks/useGetCustomerSummary.ts`

Both hooks use the string `"getCustomerSummary"` as their SWR key. This means they share a single cache slot and will overwrite each other's data.

```typescript
// useGetBookshelfSummary.ts — same key as useGetCustomerSummary!
useSWR("getCustomerSummary", ...)

// Fix — use a unique key that includes the parameter:
useSWR(`getBookshelfSummary/${customerId}`, ...)
```

### 5. `useGetHomelessId` SWR key does not include `customerId`
**File:** `client/hooks/useGetHomelessId.ts`

The static key `"getHomelessId"` means all customers share the same cache entry. If two different users use the app in the same browser session, the second user would receive the first user's homeless bookshelf ID.

```typescript
// Fix:
useSWR(`getHomelessId/${customerId}`, ...)
```

### 6. Trophy discriminator mappings are incomplete
**File:** `server/Server.Domain/BookRepoContext.cs`

`GoalScored`, `GoalSetter`, and `Alerter` trophy types exist in `Trophy.cs` and are referenced in `CustomerProvider.cs`'s type switch, but they are missing from the EF Core discriminator configuration. Reading these trophies from the database will throw a runtime exception.

```csharp
// Missing from OnModelCreating:
.HasValue<GoalScored>("GoalScored")
.HasValue<GoalSetter>("GoalSetter")
.HasValue<Alerter>("Alerter")
```

### 7. `Book.AddError` condition is always true
**File:** `server/Server.Domain/Models/Book.cs`

`Where(...)` returns an `IEnumerable<T>`, which is never `null`. The `is not { }` null check always passes, so the duplicate check never works — the same error can be added multiple times.

```csharp
// Bug: IEnumerable is never null, this check always passes
if (BookErrors.Where(x => x.Error == error.Error) is not { })

// Fix:
if (!BookErrors.Any(x => x.Error == error.Error))
```

### 8. `GetHomelessBookshelfId` creates data without saving
**File:** `server/Server/Providers/BookshelfProvider.cs`

When no homeless bookshelf exists, a new one is added to the context but `SaveChangesAsync` is never called, so the record is never persisted to the database.

```csharp
context.Bookshelves.Add(newHomeless with { CustomerId = customerId });
// Missing: await context.SaveChangesAsync(cancellationToken);
return newHomeless.Id;
```

---

## 🟠 Important — Correctness

### 9. `CommandExecutor` maps `NotFoundException` to `BadRequest`
**File:** `server/Server/Routes/CommandExecutor.cs`

A `NotFoundException` should return `404 Not Found`, not `400 Bad Request`. The current mapping is semantically incorrect and can mislead clients.

```csharp
// Current:
catch (NotFoundException ex) { return TypedResults.BadRequest(ex.Message); }

// Fix:
catch (NotFoundException ex) { return TypedResults.NotFound(ex.Message); }
```

### 10. `SharingIsCaring` threshold inconsistency
**File:** `server/Server.Domain/Models/Trophy.cs`

The trophy description says "10 sharable links" but `_sharedThreshold` is set to `1000`.

```csharp
private const int _sharedThreshold = 1000; // Description says 10 — which is correct?
```

### 11. Duplicate trophies can be awarded
**File:** `server/Server.Domain/EventHandlers/GiveCustomerTrophyEventHandler.cs`

Before adding a trophy, there is no check to see if the customer already has one of the same type. A customer could accumulate duplicate trophies.

```csharp
// Suggested check before adding:
if (customer.Trophies.Any(t => t.GetType() == notification.Trophy.GetType()))
    return;

customer.Trophies.Add(notification.Trophy);
```

### 12. `CustomerProvider.GetCustomerSummary` has write side-effects
**File:** `server/Server/Providers/CustomerProvider.cs`

A `GetCustomerSummary` read method should not be mutating state. The BetaTester trophy is awarded and saved here as a side effect of a GET request. This should be done in a separate command or event, not inside a provider query method.

---

## 🟡 Performance

### 13. Auth token and base URL fetched on every API call
**Files:** `client/services/addAuth.ts`, `client/services/addBaseUrl.ts`

Every single API call made through the client triggers two extra `fetch` calls — one to `/api/protected` to get the access token, and one to `/api/getEndpoints` to get the base URL. The base URL never changes, and the token only expires after a period. Both should be cached.

```typescript
// addAuth.ts — fetch and cache the token until expiry
// addBaseUrl.ts — fetch once and cache permanently (it never changes)
```

### 14. `getApiClient` creates a new client on every call
**File:** `client/services/getApiClient.ts`

`getApiClient()` is called at module level in hooks and services (which is fine), but calling it as a function re-creates the `Fetcher` instance and re-runs `configure` on every invocation. The client should be instantiated once.

```typescript
// Create once:
const apiClient = Fetcher.for<paths>();
apiClient.configure({ use: [addAuth(), addBaseUrl()] });
export const getApiClient = () => apiClient;
```

### 15. Sequential author lookups in `OpenLibraryClient`
**File:** `server/Server/OpenLibrary/OpenLibraryClient.cs`

`GetAuthors` makes one HTTP request per author in a `foreach` loop. For a book with multiple authors, these should be parallelised.

```csharp
// Fix:
var authorTasks = authorKeys.Select(k => _client.Author.GetDataAsync(k));
var results = await Task.WhenAll(authorTasks);
return results.Where(a => a is not null).Select(a => a!.Name).ToList();
```

---

## 🟡 Code Quality

### 16. Debug `console.log` left in production code
**File:** `client/hooks/useSearchForBooks.ts`

A `console.log` call with URL debug output is left in production code and should be removed.

```typescript
console.log(url(search).replaceAll("%20", "\\+").replaceAll("%2520", "+"));
```

### 17. Typo in action type and interface name
- **`client/hooks/addSetupWizard.ts`** — action type `"set-nickanme"` should be `"set-nickname"`.
- **`server/Server/OpenLibrary/IOpenLibraryClient.cs`** — interface is named `IOpenLibraryCient` (missing `l`). This typo propagates to all implementations and usages.

### 18. Empty try/catch blocks that just rethrow
**Files:** `client/hooks/useGetBookshelfSummary.ts`, `client/hooks/useGetCustomerSummary.ts`

Wrapping an `await` in `try { ... } catch (error) { throw error; }` adds no value. The `try/catch` should be removed entirely.

```typescript
// Remove the try/catch — it does nothing:
return (await getCustomerSummary({})).data;
```

### 19. Repeated user ownership check boilerplate in `ActionRouter`
**File:** `server/Server/Routes/ActionRouter.cs`

Every handler in `ActionRouter` repeats the same pattern:
```csharp
var userId = userContext.UserId;
if (userId is not { } || command.Id != userId) return TypedResults.Forbid();
```
This could be extracted to a helper method or an ASP.NET Core authorization policy to reduce duplication and the risk of missing the check in a new handler.

### 20. Unused variable names in `ForgetMeCommand`
**File:** `server/Server.Domain/Commands/SelfServe/ForgetMeCommand.cs`

The return values of `ExecuteDeleteAsync` are assigned to `x` and `y` but never used. Use discards (`_`) or remove the assignment.

```csharp
// Fix:
await dbContext.Bookshelves.Where(x => x.CustomerId == Id).ExecuteDeleteAsync(cancellationToken);
await dbContext.Customer.Where(x => x.Id == customer.Id).ExecuteDeleteAsync(cancellationToken);
```

### 21. `CustomerBook` and `BookshelfBook` use `class` instead of `record`
**Files:** `server/Server.Domain/Models/CustomerBook.cs`, `server/Server.Domain/Models/BookshelfBook.cs`

All other domain models use `record` types (per the project conventions), but these two use `class`. They should be made consistent.

### 22. `BookRepoContext.Customer` DbSet is named in the singular
**File:** `server/Server.Domain/BookRepoContext.cs`

All other DbSet properties are plural (`Books`, `Bookshelves`, `CustomerBooks`, etc.) but `Customer` is singular. This is inconsistent and can cause confusion.

```csharp
// Inconsistent:
public DbSet<Customer> Customer { get; set; }

// Should be:
public DbSet<Customer> Customers { get; set; }
```

### 23. Runtime type cast without validation in `useSearchForBooks`
**File:** `client/hooks/useSearchForBooks.ts`

`data as SearchResponse` bypasses TypeScript's type safety and there is already a comment acknowledging that schema validation is needed. Consider using a library such as [Zod](https://zod.dev) to parse and validate the Open Library API response at runtime.

---

## 🔵 Tech Debt (Known TODOs)

The following are existing `// TODO` comments worth tracking:

| Location | Note |
|---|---|
| `SetupCustomerCommand.cs` | Missing structured logging when a book is skipped during setup |
| `RateCustomerBookCommand.cs` | `Ranking` has no range validation — any integer is accepted |
| `Bookshelf.cs` | `HomelessBooks` bool should be replaced with a bookshelf type enum/scalar |
