using Server.Domain.Models;

namespace Server.OpenLibrary;

public interface IOpenLibraryClient
{
    public Task<Book?> GetBook(string isbn, CancellationToken cancellationToken);
}
