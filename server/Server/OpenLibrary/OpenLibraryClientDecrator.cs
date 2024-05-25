using Server.Domain;
using Server.Domain.Models;

namespace Server.OpenLibrary;

public class OpenLibraryClientDecorator(BookRepoContext context, OpenLibraryClient client)
    : IOpenLibraryCient
{
    public async Task<Book?> GetBook(string isbn, CancellationToken cancellationToken)
    {
        if ((await context.Books.FindAsync([ isbn ], cancellationToken)) is { } book)
        {
            return book;
        }
        return await client.GetBook(isbn, cancellationToken);
    }
}
