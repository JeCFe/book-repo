using Server.Domain.Models;

namespace Server.OpenLibrary;

public class OpenLibraryClient() : IOpenLibraryCient
{
    public Task<Book?> GetBook(string isbn, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
