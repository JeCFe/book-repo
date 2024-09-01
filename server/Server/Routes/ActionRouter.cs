namespace Server.Routes;

using Common.Context;
using Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Domain.Commands;

public static class ActionRouter
{
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

    private static async Task<Results<NoContent, ForbidHttpResult>> RemoveBookshelf(
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

    private static async Task<Results<NoContent, ForbidHttpResult>> RateCustomerBook(
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

    public static RouteGroupBuilder MapActionEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Actions");

        group.MapPost("/forget-me", CommandExecutor.Execute<ForgetMeCommand>);
        group.MapPost("/add-bookshelf", CommandExecutor.Execute<AddBookshelfCommand>);
        group.MapPost("/setup-customer", CommandExecutor.Execute<SetupCustomerCommand>);
        group.MapPost("/remove-bookshelf", CommandExecutor.Execute<RemoveBookshelfCommand>);
        group.MapPost("/add-book-shelf-book", CommandExecutor.Execute<AddBookshelfBookCommand>);
        group.MapPost(
            "/comment-customer-book",
            CommandExecutor.Execute<AddCustomerBookCommentCommand>
        );
        group.MapPost(
            "/update-bookshelf-order",
            CommandExecutor.Execute<UpdateBookcaseOrderCommand>
        );
        group.MapPost("shareable/remove", CommandExecutor.Execute<RemoveShareableCommand>);

        group.MapPost("shareable/add", AddShareable);

        group.MapPost("/raise-book-error", RaiseBookError);
        group.MapPost("/rate-customer-book", RateCustomerBook);
        group.MapPost("/remove-bookshelf-book", RemoveBookshelfBook);
        group.MapPost("/add-customer-book-bookshelf", AddCustomerBookToBookshelf);

        return group;
    }
}
