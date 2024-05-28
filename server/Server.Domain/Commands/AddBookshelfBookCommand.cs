namespace Server.Domain.Commands;

using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class AddBookshelfBookCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public required string Isbn { get; init; }
    public required List<Guid> BookshelfId { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        var customer = await dbContext
            .Customer
            .Include(x => x.Bookshelves)
            .SingleOrDefaultAsync(x => x.Id == Id, cancellationToken);
        var book = await dbContext.Books.FindAsync([ Isbn ], cancellationToken);

        if (customer == null || book == null)
        {
            return; // Handle missing customer or book
        }

        foreach (var bookshelf in customer.Bookshelves)
        {
            var bookshelfCount = dbContext
                .BookshelfBook
                .Where(x => x.BookshelfId == bookshelf.Id)
                .Count();

            dbContext
                .BookshelfBook
                .Add(
                    new()
                    {
                        Book = book,
                        Isbn = book.Isbn,
                        Bookshelf = bookshelf,
                        BookshelfId = bookshelf.Id,
                        Order = bookshelfCount + 1
                    }
                );
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
