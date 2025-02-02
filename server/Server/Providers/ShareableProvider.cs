namespace Server.Providers;

using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;
using Server.Models;

public class ShareableProvider(BookRepoContext context) : IShareableProvider
{
    public async Task<Shareable?> GetShareable(Guid shareId, CancellationToken cancellationToken) =>
        await context.Shareables.FindAsync([shareId], cancellationToken);

    public async Task<List<ShareableSummary>?> GetShareables(
        string customerId,
        CancellationToken cancellationToken
    ) =>
        await context
            .Shareables.Where(x => x.Customer.Id == customerId)
            .Select(shareable => new ShareableSummary
            {
                Id = shareable.Id,
                Title = shareable.Title,
                Created = shareable.CreatedAt,
            })
            .ToListAsync(cancellationToken);

    Task<List<ShareableSummary>?> IShareableProvider.GetShareables(
        string customerId,
        CancellationToken cancellationToken
    )
    {
        throw new NotImplementedException();
    }
}
