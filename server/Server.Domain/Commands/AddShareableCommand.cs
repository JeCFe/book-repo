namespace Server.Domain.Commands;

using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Exceptions;
using Server.Domain.Models;

public class AddShareableCommand : ICommand<BookRepoContext>
{
    public required Shareable Shareable { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if ((await dbContext.Shareables.FindAsync([ Shareable.Id ], cancellationToken)) is not { })
        {
            return;
        }

        var dbCustomer = await dbContext
            .Customer
            .Include(x => x.Bookshelves)
            .SingleOrDefaultAsync(x => x.Id == Shareable.Customer.Id, cancellationToken);

        if (dbCustomer is not { } customer)
        {
            throw new UserNotFoundException();
        }

        Shareable shareable =
            new()
            {
                Id = Shareable.Id,
                Title = Shareable.Title,
                Customer = customer
            };

        if (Shareable.Bookshelves is { })
        {
            foreach (var bookshelf in Shareable.Bookshelves)
            {
                if (
                    dbCustomer.Bookshelves.SingleOrDefault(x => x.Id == bookshelf.Bookshelf.Id)
                    is not { } validBookshelf
                )
                {
                    throw new BookshelfNotFound();
                }
                shareable
                    .Bookshelves
                    .Add(
                        new ShareableBookshelf()
                        {
                            Bookshelf = validBookshelf,
                            Order = bookshelf.Order
                        }
                    );
            }
        }

        if (Shareable.Showcase is { })
        {
            if (
                (
                    await dbContext
                        .CustomerBooks
                        .FindAsync([ Shareable.Showcase.CustomerBook.Id ], cancellationToken)
                )
                is not { } customerBook
            )
            {
                throw new CustomerBookNotFoundException();
            }

            shareable.Showcase = new ShareableBookShowcase()
            {
                CustomerBook = new()
                {
                    Id = customerBook.Id,
                    CustomerId = customerBook.CustomerId,
                    Isbn = customerBook.Isbn,
                    Customer = customerBook.Customer,
                    Book = customerBook.Book,
                    Comment = Shareable.Showcase.ShowComment ? customerBook.Comment : null,
                    Ranking = Shareable.Showcase.ShowRanking ? customerBook.Ranking : 0
                },
                ShowRanking = Shareable.Showcase.ShowRanking,
                ShowComment = Shareable.Showcase.ShowComment
            };
        }

        dbContext.Shareables.Add(shareable);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
