using Server.Models;

namespace Server.Providers;

public interface IBookshelfProvider
{
    public Task<Bookshelf?> GetBookshelfById(Guid id, CancellationToken cancellationToken);
    public Task<List<BookshelfSummary>> GetBookshelfSummary(
        string customerId,
        CancellationToken cancellationToken
    );
}
