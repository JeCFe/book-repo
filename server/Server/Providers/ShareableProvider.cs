namespace Server.Providers;

using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;

public class shareableProvider(BookRepoContext context) : IShareableProvider
{
    public async Task<Shareable?> GetShareable(Guid shareId, CancellationToken cancellationToken) =>
        await context.Shareables.FindAsync([ shareId ], cancellationToken);

    public async Task<List<ShareableSummary>?> GetShareables(
        string customerId,
        CancellationToken cancellationToken
    ) =>
        await context
            .Shareables
            .Where(x => x.Customer.Id == customerId)
            .Select(
                shareable =>
                    new ShareableSummary
                    {
                        Id = shareable.Id,
                        Title = shareable.Title,
                        Created = shareable.CreatedAt
                    }
            )
            .ToListAsync(cancellationToken);
}
