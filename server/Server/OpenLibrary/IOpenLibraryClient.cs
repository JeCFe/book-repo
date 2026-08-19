using Server.Domain.Models;

namespace Server.OpenLibrary;

public interface IOpenLibraryCient
{
    public Task<Book?> GetBook(string isbn, CancellationToken cancellationToken);
}
