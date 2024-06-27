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

    private static async Task<Results<NoContent, NotFound, ForbidHttpResult>> RemoveBookshelfBook(
        RemoveBookshelfBookCommand command,
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

        var amount = await mediator.Send(command, cancellationToken);
        if (amount == 0)
        {
            return TypedResults.NotFound();
        }
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound, ForbidHttpResult>> RemoveBookshelf(
        RemoveBookshelfCommand command,
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
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound, ForbidHttpResult>> AddBookshelf(
        AddBookshelfCommand command,
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
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound, ForbidHttpResult>> RateCustomerBook(
        RateCustomerBookCommand command,
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
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound, ForbidHttpResult>> CommentCustomerBook(
        AddCustomerBookCommentCommand command,
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
        return TypedResults.NoContent();
    }

    public static RouteGroupBuilder MapActionEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Actions");

        group.MapPost("/forget-me", ForgetMe);
        group.MapPost("/add-bookshelf", AddBookshelf);
        group.MapPost("/setup-customer", SetupCustomer);
        group.MapPost("/remove-bookshelf", RemoveBookshelf);
        group.MapPost("/rate-customer-book", RateCustomerBook);
        group.MapPost("/add-book-shelf-book", AddBookshelfBook);
        group.MapPost("/comment-customer-book", CommentCustomerBook);
        group.MapPost("/remove-bookshelf-book", RemoveBookshelfBook);
        group.MapPost("/update-bookshelf-order", UpdateBookshelfOrder);

        return group;
    }
}
