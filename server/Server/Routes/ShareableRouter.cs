namespace Server.Routes;

using Common.Context;
using Microsoft.AspNetCore.Http.HttpResults;
using Server.Domain.Models;
using Server.Models;
using Server.Providers;

public static class ShareableRouter
{
    private static async Task<Results<Ok<Shareable>, NotFound>> GetShareable(
        Guid shareId,
        IShareableProvider shareableProvider,
        CancellationToken cancellationToken
    )
    {
        if (await shareableProvider.GetShareable(shareId, cancellationToken) is not { } shareable)
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(shareable);
    }

    private static async Task<
        Results<Ok<List<ShareableSummary>>, NotFound, ForbidHttpResult>
    > GetShareables(
        string customerId,
        IUserContext userContext,
        IShareableProvider shareableProvider,
        CancellationToken cancellationToken
    )
    {
        if (userContext.UserId != customerId)
        {
            return TypedResults.Forbid();
        }

        if (
            await shareableProvider.GetShareables(customerId, cancellationToken)
            is not { } shareables
        )
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(shareables);
    }

    public static RouteGroupBuilder MapShareableEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Shareable");
        group.MapGet("/{ShareId}", GetShareable);
        group.MapGet("/all/{CustomerId}", GetShareables);

        return group;
    }
}
