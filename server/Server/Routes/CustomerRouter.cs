using Auth0.ManagementApi.Models;
using Common.Context;
using Common.Exceptions;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Auth0;
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

    public static async Task<Results<ForbidHttpResult, NoContent, ProblemHttpResult>> Delete(
        IUserContext userContext,
        IAuth0Client client,
        DeleteRequest request,
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
            await client.Delete(request.Id, cancellationToken);
        }
        catch (UnableToDeleteUserException)
        {
            return TypedResults.Problem(
                new() { Title = "User unable to be deleted", Status = 422, }
            );
        }
        return TypedResults.NoContent();
    }

    public static async Task<
        Results<Ok<User>, BadRequest<string>, ForbidHttpResult, NotFound>
    > Update(
        IUserContext userContext,
        IAuth0Client client,
        CustomerUpdateRequest request,
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
            var user = await client.Update(request, cancellationToken);
            return TypedResults.Ok(user);
        }
        catch (BadRequestException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
    }

    private static async Task<
        Results<Ok<ResponseCustomerBook>, NotFound, ForbidHttpResult>
    > GetCustomerBook(
        string customerId,
        Guid customerBookId,
        ICustomerProvider customerProvider,
        IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var userId = userContext.UserId;
        if (userId is not { })
        {
            return TypedResults.Forbid();
        }
        if (
            await customerProvider.GetCustomerBook(customerBookId, userId, cancellationToken)
            is not { } book
        )
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(book);
    }

    private static async Task<Ok<List<ResponseCustomerBook>>> GetCustomerBooks(
        ICustomerProvider customerProvider,
        IUserContext userContext,
        CancellationToken cancellationToken
    ) =>
        TypedResults.Ok(
            await customerProvider.GetCustomerBooks(userContext.UserId!, cancellationToken)
        );

    public static RouteGroupBuilder MapCustomerEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Customer");
        group.MapPost("/delete", Delete).RequireAuthorization();
        group.MapPost("/update", Update).RequireAuthorization();
        group.MapGet("/books", GetCustomerBooks).RequireAuthorization();
        group.MapGet("/get-customer-summary", GetCustomerSummary).RequireAuthorization();
        group.MapGet("/{customerId}/{customerBookId}", GetCustomerBook).RequireAuthorization();
        return group;
    }
}
