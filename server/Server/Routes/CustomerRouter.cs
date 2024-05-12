using Microsoft.AspNetCore.Http.HttpResults;
using Server.Context;
using Server.Exceptions;
using Server.Models;
using Server.Providers;

namespace Server.Routes;

public static class CustomerRouter
{
    private static async Task<Results<Ok<CustomerSummary>, ForbidHttpResult>> GetCustomerSummary(
        IUserContext userContext,
        ICustomerProvider customerProvider,
        CancellationToken cancellationToken
    )
    {
        var userId = userContext.UserId;
        if (userId is not { })
        {
            return TypedResults.Forbid();
        }

        return TypedResults.Ok(
            await customerProvider.GetCustomerSummary(userId, cancellationToken)
        );
    }

    public static RouteGroupBuilder MapCustomerEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Customer");
        group.MapGet("/get-customer-summary", GetCustomerSummary).RequireAuthorization();
        return group;
    }
}
