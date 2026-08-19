namespace Server.Domain.Commands;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Domain;
using Server.Domain.Events;
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
            .Customer.Include(x => x.Bookshelves)
            .SingleOrDefaultAsync(x => x.Id == Id, cancellationToken);
        var book = await dbContext.Books.FindAsync([Isbn], cancellationToken);

        if (customer == null || book == null)
        {
            return; // Handle missing customer or book
        }

        var customerBook = await dbContext.CustomerBooks.SingleOrDefaultAsync(
            x => x.Isbn == Isbn && x.CustomerId == customer.Id,
            cancellationToken
        );

        if (customerBook is not { })
        {
            customerBook = new CustomerBook()
            {
                Id = Guid.NewGuid(),
                Isbn = Isbn,
                Book = book,
                CustomerId = customer.Id,
                Customer = customer,
            };
            dbContext.CustomerBooks.Add(customerBook);
        }

        if (BookshelfId.IsNullOrEmpty())
        {
            if (customer.Bookshelves.SingleOrDefault(x => x.HomelessBooks == true) is not { })
            {
                var newHomeless = StaticBookshelf.Homeless();
                customer.Bookshelves = [.. customer.Bookshelves, newHomeless];
                dbContext.BookshelfBook.Add(
                    new()
                    {
                        CustomerBook = customerBook,
                        CustomerBookId = customerBook.Id,
                        Isbn = book.Isbn,
                        Bookshelf = newHomeless,
                        BookshelfId = newHomeless.Id,
                        Order = 0,
                    }
                );
                await dbContext.SaveChangesAsync(cancellationToken);
                return;
            }
            var homeless = customer.Bookshelves.Single(x => x.HomelessBooks == true);
            dbContext.BookshelfBook.Add(
                new()
                {
                    CustomerBook = customerBook,
                    CustomerBookId = customerBook.Id,
                    Isbn = book.Isbn,
                    Bookshelf = homeless,
                    BookshelfId = homeless.Id,
                    Order =
                        dbContext.BookshelfBook.Where(x => x.BookshelfId == homeless.Id).Count()
                        + 1,
                }
            );
            await dbContext.SaveChangesAsync(cancellationToken);
            return;
        }

        var selectedBookshelves = customer
            .Bookshelves.Where(b => BookshelfId.Contains(b.Id))
            .ToList();

        foreach (var bookshelf in selectedBookshelves)
        {
            var bookshelfCount = dbContext
                .BookshelfBook.Where(x => x.BookshelfId == bookshelf.Id)
                .Count();

            dbContext.BookshelfBook.Add(
                new()
                {
                    CustomerBook = customerBook,
                    CustomerBookId = customerBook.Id,
                    Isbn = book.Isbn,
                    Bookshelf = bookshelf,
                    BookshelfId = bookshelf.Id,
                    Order = bookshelfCount + 1,
                }
            );
        }

        await ctx.Publish(
            new GiveCustomerTrophyEvent(
                Id,
                new BookAddict(
                    await dbContext
                        .CustomerBooks.Where(x => x.Customer.Id == Id)
                        .CountAsync(cancellationToken)
                )
            ),
            cancellationToken
        );

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
