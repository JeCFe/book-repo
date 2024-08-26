namespace Server.Routes;

using Common.Context;
using Common.Context;
using Common.MediatR;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Domain.Commands;
using Server.Domain.Exceptions;

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

    private static async Task<
        Results<NoContent, BadRequest<string>, ForbidHttpResult>
    > AddCustomerBookToBookshelf(
        AddCustomerBookToBookshelfCommand command,
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

        try
        {
            await mediator.Send(command, cancellationToken);
            return TypedResults.NoContent();
        }
        catch (CustomerBookNotFoundException)
        {
            return TypedResults.BadRequest("Customer book not found");
        }
        catch (BookshelfNotFound)
        {
            return TypedResults.BadRequest("Bookshelf not found");
        }
    }

    private static async Task<
        Results<NoContent, BadRequest<string>, ForbidHttpResult>
    > AddShareable(
        AddShareableCommand command,
        IMediator mediator,
        IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var userId = userContext.UserId;
        if (userId is not { } || command.Shareable.CustomerId != userId)
        {
            return TypedResults.Forbid();
        }

        try
        {
            await mediator.Send(command, cancellationToken);
            return TypedResults.NoContent();
        }
        catch (CustomerBookNotFoundException)
        {
            return TypedResults.BadRequest("Customer book not found");
        }
        catch (BookshelfNotFound)
        {
            return TypedResults.BadRequest("Bookshelf not found");
        }
    }

    private static async Task<
        Results<NoContent, BadRequest<string>, ForbidHttpResult>
    > RaiseBookError(
        AddBookErrorCommand command,
        IMediator mediator,
        CancellationToken cancellationToken
    )
    {
        try
        {
            await mediator.Send(command, cancellationToken);
            return TypedResults.NoContent();
        }
        catch (BookNotFoundException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
        catch (BookContainsErrorException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
    }

    private static async Task<Results<NoContent, ForbidHttpResult>> RemoveShareable(
        RemoveShareableCommand command,
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
        group.MapPost("/raise-book-error", RaiseBookError);
        group.MapPost("/remove-bookshelf", RemoveBookshelf);
        group.MapPost("/rate-customer-book", RateCustomerBook);
        group.MapPost("/add-book-shelf-book", AddBookshelfBook);
        group.MapPost("/comment-customer-book", CommentCustomerBook);
        group.MapPost("/remove-bookshelf-book", RemoveBookshelfBook);
        group.MapPost("/update-bookshelf-order", UpdateBookshelfOrder);
        group.MapPost("/add-customer-book-bookshelf", AddCustomerBookToBookshelf);

        group.MapPost("shareable/add", AddShareable);
        group.MapPost("shareable/remove", RemoveShareable);

        return group;
    }
}
