namespace Server.Routes;

using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.Context;
using Server.Domain.Commands;

public static class ActionRouter
{
    private static async Task<Results<Ok, ForbidHttpResult>> ForgetMe(
        ForgetMeCommand command,
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
        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, ForbidHttpResult>> SetupCustomer(
        SetupCustomerCommand command,
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
        return TypedResults.Ok();
    }

    public static RouteGroupBuilder MapActionEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Actions");
        group.MapPost("/forget-me", ForgetMe).RequireAuthorization();
        group.MapPost("/setup-customer", SetupCustomer).RequireAuthorization();
        return group;
    }
}
