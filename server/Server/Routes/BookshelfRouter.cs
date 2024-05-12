using Microsoft.AspNetCore.Http.HttpResults;
using Server.Exceptions;
using Server.Models;
using Server.Providers;

namespace Server.Routes;

public static class BookshelfRouter
{
    private static async Task<Results<Ok<CustomerSummary>, ForbidHttpResult>> GetCustomerSummary(
        ICustomerProvider bookshelfProvider,
        CancellationToken cancellationToken
    )
    {
        try
        {
            return TypedResults.Ok(await bookshelfProvider.GetCustomerSummary(cancellationToken));
        }
        catch (InvalidUserException)
        {
            return TypedResults.Forbid();
        }
    }

    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Customer");
        group.MapGet("/get-customer-summary", GetCustomerSummary).RequireAuthorization();
        return group;
    }
}
