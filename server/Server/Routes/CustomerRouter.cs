using Azure.Core;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Auth0;
using Server.Context;
using Server.Exceptions;
using Server.Models;
using Server.Providers;

namespace Server.Routes;

public static class CustomerRouter
{
    private static async Task<
        Results<Ok<CustomerSummary>, ForbidHttpResult, NotFound>
    > GetCustomerSummary(
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

        try
        {
            return TypedResults.Ok(
                await customerProvider.GetCustomerSummary(userId, cancellationToken)
            );
        }
        catch (UserNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }

    public static async Task<Results<ForbidHttpResult, Ok, ProblemHttpResult>> Delete(
        IUserContext userContext,
        IAuth0Client client,
        string id
    )
    {
        var userId = userContext.UserId;
        if (userId is not { })
        {
            return TypedResults.Forbid();
        }
        try
        {
            await client.Delete(id);
        }
        catch (UnableToDeleteUserException)
        {
            return TypedResults.Problem(
                new() { Title = "User unable to be deleted", Status = 422, }
            );
        }
        return TypedResults.Ok();
    }

    public static RouteGroupBuilder MapCustomerEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Customer");
        group.MapGet("/get-customer-summary", GetCustomerSummary).RequireAuthorization();
        group.MapPost("/delete", Delete);
        return group;
    }
}
