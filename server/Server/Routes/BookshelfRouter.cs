using Auth0.ManagementApi.Models;
using Azure.Core;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Auth0;
using Server.Context;
using Server.Domain.Models;
using Server.Exceptions;
using Server.Models;
using Server.OpenLibrary;
using Server.Providers;

namespace Server.Routes;

public static class BookshelfRouter
{
    private static async Task<Results<Ok<Book>, NotFound, ForbidHttpResult>> GetBookshelf(
        Guid bookshelfId,
        IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var userId = userContext.UserId;
        if (userId is not { })
        {
            return TypedResults.Forbid();
        }
    }

    public static RouteGroupBuilder MapBookshelfEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Bookshelf");
        group.MapGet("/{bookshelfId}", GetBookshelf);

        return group;
    }
}
