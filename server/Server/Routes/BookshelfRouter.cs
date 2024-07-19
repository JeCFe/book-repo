namespace Server.Routes;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.Context;
using Server.Exceptions;
using Server.Models;
using Server.Providers;

public static class BookshelfRouter
{
    private static async Task<Results<Ok<CustomerBookshelf>, NotFound>> GetBookshelf(
        [FromRoute] Guid bookshelfId,
        [FromServices] IBookshelfProvider bookshelfProvider,
        [FromServices] IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var bookshelf = await bookshelfProvider.GetBookshelfById(bookshelfId, cancellationToken);
        if (bookshelf is not { })
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(bookshelf);
    }

    public static async Task<
        Results<Ok<List<BookshelfSummary>>, NotFound, ForbidHttpResult>
    > GetBookshelfSummary(
        string customerId,
        IBookshelfProvider provider,
        IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var userId = userContext.UserId;
        if (userId is not { } || customerId != userId)
        {
            return TypedResults.Forbid();
        }
        var bookshelf = await provider.GetBookshelfSummary(customerId, cancellationToken);
        if (bookshelf is not { })
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(bookshelf);
    }

    public static async Task<
        Results<Ok<Guid>, NotFound<string>, ForbidHttpResult>
    > GetHomelessBookshelfId(
        string customerId,
        IBookshelfProvider provider,
        IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var userId = userContext.UserId;
        if (userId is not { } || customerId != userId)
        {
            return TypedResults.Forbid();
        }
        try
        {
            var bookshelf = await provider.GetHomelessBookshelfId(customerId, cancellationToken);
            return TypedResults.Ok(bookshelf);
        }
        catch (UserNotFoundException)
        {
            return TypedResults.NotFound("Customer account not found");
        }
    }

    public static RouteGroupBuilder MapBookshelfEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Bookshelf");
        group.MapGet("/{bookshelfId}", GetBookshelf);
        group.MapGet("/summary/{customerId}", GetBookshelfSummary);
        group.MapGet("/homeless/{customerId}", GetHomelessBookshelfId);

        return group;
    }
}
