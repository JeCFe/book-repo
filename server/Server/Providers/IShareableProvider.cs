using Server.Domain.Models;
using Server.Providers;

public interface IShareableProvider
{
    Task<Shareable?> GetShareable(Guid shareId, CancellationToken cancellationToken);
    Task<List<ShareableSummary>?> GetShareables(
        Guid customerId,
        CancellationToken cancellationToken
    );
}
