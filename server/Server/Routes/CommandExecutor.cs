using Common.Context;
using Common.Exceptions;
using Common.MediatR;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Domain;

namespace Server.Routes;

public static class CommandExecutor
{
    public static async Task<Results<Ok, BadRequest<string>, ForbidHttpResult>> Execute<T>(
        T cmd,
        IMediator mediator,
        CancellationToken cancellationToken
    )
        where T : ICommand<BookRepoContext>
    {
        try
        {
            await mediator.Send(cmd, cancellationToken);
            return TypedResults.Ok();
        }
        catch (NotFoundException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
        catch (InvalidUserException)
        {
            return TypedResults.Forbid();
        }
    }
}
