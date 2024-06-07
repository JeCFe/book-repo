namespace Server.Routes;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.Context;
using Server.Exceptions;
using Server.Models;
using Server.Providers;

public static class BookshelfRouter
{
    private static async Task<Results<Ok<Bookshelf>, NotFound>> GetBookshelf(
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
        Results<Ok<List<BookshelfSummary>>, NotFound<string>, ForbidHttpResult>
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
        try
        {
            return TypedResults.Ok(
                await provider.GetBookshelfSummary(customerId, cancellationToken)
            );
        }
        catch (UserNotFoundException)
        {
            return TypedResults.NotFound("User not found");
        }
    }

    public static RouteGroupBuilder MapBookshelfEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Bookshelf");
        group.MapGet("/{bookshelfId}", GetBookshelf);
        group.MapGet("/summary/{customerId}", GetBookshelfSummary);

        return group;
    }
}
