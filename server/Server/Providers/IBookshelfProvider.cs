using Server.Models;

namespace Server.Providers;

public interface IBookshelfProvider
{
    public Task<CustomerBookshelf?> GetBookshelfById(Guid id, CancellationToken cancellationToken);
    public Task<List<BookshelfSummary>> GetBookshelfSummary(
        string customerId,
        CancellationToken cancellationToken
    );
    public Task<Guid> GetHomelessBookshelfId(
        string customerId,
        CancellationToken cancellationToken
    );
}
