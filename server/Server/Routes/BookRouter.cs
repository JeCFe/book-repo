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

public static class BookRouter
{
    private static async Task<Results<Ok<Book>, NotFound>> GetBook(
        string isbn,
        IOpenLibraryCient client,
        CancellationToken cancellationToken
    )
    {
        if (await client.GetBook(isbn, cancellationToken) is not { } book)
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(book);
    }

    public static RouteGroupBuilder MapBookEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Book");
        group.MapGet("/{isbn}", GetBook);

        return group;
    }
}
