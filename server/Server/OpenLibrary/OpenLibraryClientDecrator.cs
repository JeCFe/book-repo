using Microsoft.EntityFrameworkCore;
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

        var newBook = await client.GetBook(isbn, cancellationToken);
        if (newBook is not null)
        {
            await context.Books.AddAsync(newBook, cancellationToken);
            try
            {
                await context.SaveChangesAsync(cancellationToken);
            }
            //This catches if the book can't save due to duplicate entries, should stop race conditions blowing up the server
            catch (DbUpdateException) { }
        }
        return newBook;
    }
}
