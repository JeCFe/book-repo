namespace Server.Providers;

using Server.Domain.Models;

public interface IShareableProvider
{
    Task<Shareable?> GetShareable(Guid shareId, CancellationToken cancellationToken);
    Task<List<ShareableSummary>?> GetShareables(
        string customerId,
        CancellationToken cancellationToken
    );
}
