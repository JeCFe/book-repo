namespace Server.Domain.Commands;

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Domain;
using Server.Domain.Models;

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

        if (BookshelfId.IsNullOrEmpty())
        {
            if (customer.Bookshelves.SingleOrDefault(x => x.HomelessBooks == true) is not { })
            {
                var newHomeless = StaticBookshelf.Homeless();
                customer.Bookshelves =  [ ..customer.Bookshelves, newHomeless ];
                dbContext
                    .BookshelfBook
                    .Add(
                        new()
                        {
                            Book = book,
                            Isbn = book.Isbn,
                            Bookshelf = newHomeless,
                            BookshelfId = newHomeless.Id,
                            Order = 0
                        }
                    );
                await dbContext.SaveChangesAsync(cancellationToken);
                return;
            }
            var homeless = customer.Bookshelves.Single(x => x.HomelessBooks == true);
            dbContext
                .BookshelfBook
                .Add(
                    new()
                    {
                        Book = book,
                        Isbn = book.Isbn,
                        Bookshelf = homeless,
                        BookshelfId = homeless.Id,
                        Order =
                            dbContext.BookshelfBook.Where(x => x.BookshelfId == homeless.Id).Count()
                            + 1
                    }
                );
            await dbContext.SaveChangesAsync(cancellationToken);
            return;
        }

        var selectedBookshelves = customer
            .Bookshelves
            .Where(b => BookshelfId.Contains(b.Id))
            .ToList();

        foreach (var bookshelf in selectedBookshelves)
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
