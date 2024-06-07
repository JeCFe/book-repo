namespace Server.Domain.Commands;

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Domain;
using Server.Domain.Models;

public class SetupCustomerCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public List<string>? BookshelvesNames { get; init; }
    public List<string>? Isbns { get; init; }
    public bool IncludeDefaultBookshelves { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            await dbContext.Customer.SingleOrDefaultAsync(x => x.Id == Id, cancellationToken) is { }
        )
        {
            return;
        }

        Customer customer = new() { Id = Id, CreationDate = ctx.time.GetUtcNow(), };

        if (Isbns is { } isbns)
        {
            var homelessBookBookshelf = StaticBookshelf.Homeless();
            customer.Bookshelves =  [ ..customer.Bookshelves, homelessBookBookshelf ];

            List<BookshelfBook> bookshelfBooks =  [ ];
            foreach (var isbn in isbns)
            {
                //Note: For the UI to display a book that book must already exist in our db
                var book = await dbContext.Books.FindAsync([ isbn ], cancellationToken);
                if (book is null)
                {
                    continue; //TODO: This should have strcutured logging
                }
                bookshelfBooks.Add(
                    new BookshelfBook()
                    {
                        BookshelfId = homelessBookBookshelf.Id,
                        Isbn = isbn,
                        Order = bookshelfBooks.Count(),
                        Book = book,
                        Bookshelf = homelessBookBookshelf
                    }
                );
            }
            dbContext.BookshelfBook.AddRange(bookshelfBooks);
        }

        if (IncludeDefaultBookshelves)
        {
            customer.Bookshelves =
            [
                ..customer.Bookshelves,
                StaticBookshelf.WantingToRead(),
                StaticBookshelf.CurrentlyRead(),
                StaticBookshelf.Read(),
            ];
        }

        if (BookshelvesNames is { } names)
        {
            List<Bookshelf> customBookshelves =  [ ];
            foreach (var name in names)
            {
                customBookshelves.Add(
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = name,
                        CreationDate = DateTimeOffset.UtcNow
                    }
                );
            }
            customer.Bookshelves =  [ ..customer.Bookshelves, ..customBookshelves ];
        }

        dbContext.Customer.Add(customer);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
