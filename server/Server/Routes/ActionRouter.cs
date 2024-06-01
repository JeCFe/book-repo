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

    private static async Task<Results<Ok, ForbidHttpResult>> AddBookshelfBook(
        AddBookshelfBookCommand command,
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

    private static async Task<Results<Ok, ForbidHttpResult>> UpdateBookshelfOrder(
        UpdateBookcaseOrderCommand command,
        IMediator mediator,
        IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var userId = userContext.UserId;
        if (userId is not { } || command.CustomerId != userId)
        {
            return TypedResults.Forbid();
        }

        await mediator.Send(command, cancellationToken);
        return TypedResults.Ok();
    }

    public static RouteGroupBuilder MapActionEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Actions");
        group.MapPost("/forget-me", ForgetMe);
        group.MapPost("/setup-customer", SetupCustomer);
        group.MapPost("/add-book-shelf-book", AddBookshelfBook);
        group.MapPost("/update-bookshelf-order", UpdateBookshelfOrder);
        return group;
    }
}
