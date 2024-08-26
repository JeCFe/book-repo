namespace Server.Domain.Commands;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Events;
using Server.Domain.Models;

public class SetupCustomerCommand() : ICommand<BookRepoContext>
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

        Customer customer = new() { Id = Id, CreationDate = ctx.Time.GetUtcNow(), };

        if (Isbns is { } isbns)
        {
            var homelessBookBookshelf = StaticBookshelf.Homeless();
            customer.Bookshelves =  [ ..customer.Bookshelves, homelessBookBookshelf ];

            List<BookshelfBook> bookshelfBooks =  [ ];
            foreach (var isbn in isbns)
            {
                //Note: For the UI to display a book that book must already exist in our db
                var book = await dbContext.Books.FindAsync([ isbn ], cancellationToken);

                var customerBook = await dbContext
                    .CustomerBooks
                    .SingleOrDefaultAsync(
                        x => x.Isbn == isbn && x.CustomerId == customer.Id,
                        cancellationToken
                    );

                if (book is null)
                {
                    continue; //TODO: This should have strcutured logging
                }

                if (customerBook is not { })
                {
                    customerBook = new CustomerBook()
                    {
                        Id = Guid.NewGuid(),
                        Isbn = isbn,
                        Book = book,
                        CustomerId = customer.Id,
                        Customer = customer
                    };
                    dbContext.CustomerBooks.Add(customerBook);
                }

                bookshelfBooks.Add(
                    new BookshelfBook()
                    {
                        BookshelfId = homelessBookBookshelf.Id,
                        CustomerBook = customerBook,
                        Order = bookshelfBooks.Count(),
                        CustomerBookId = customerBook.Id,
                        Bookshelf = homelessBookBookshelf,
                        Isbn = isbn
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

        // TOOO: Come back to use options to handle whether in beta
        await ctx.Publish(
            new GiveCustomerTrophyEvent(
                customer.Id,
                new BetaTester(true) { DateJoined = ctx.Time.GetUtcNow() }
            ),
            cancellationToken
        );

        dbContext.Customer.Add(customer);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
