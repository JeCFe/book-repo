using Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Domain.Commands.Admin;

namespace Server.Routes;

public static class AdminEndpoints
{
    private static Ok<string> HelloWorld(CancellationToken cancellationToken)
    {
        return TypedResults.Ok("Hello world");
    }

    private static async Task<Ok> AddContributorTrophy(
        AddContributorTrophyCommand command,
        IMediator mediator,
        CancellationToken cancellationToken
    )
    {
        //TODO: Need to try catch for a bad request
        await mediator.Send(command, cancellationToken);
        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, BadRequest<string>>> UpdateBookError(
        UpdateBookErrorCommand command,
        IMediator mediator,
        CancellationToken cancellationToken
    )
    {
        try
        {
            await mediator.Send(command, cancellationToken);
            return TypedResults.Ok();
        }
        catch (NotFoundException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
    }

    public static RouteGroupBuilder MapAdminEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/add-contributor-trophy", AddContributorTrophy);
        return group;
    }
}
