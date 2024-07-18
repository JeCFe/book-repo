namespace Server.Domain.Commands;

using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Exceptions;
using Server.Domain.Models;

public class AddShareableCommand : ICommand<BookRepoContext>
{
    public required CommandShareable Shareable { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if ((await dbContext.Shareables.FindAsync([ Shareable.Id ], cancellationToken)) is { })
        {
            return;
        }

        var dbCustomer = await dbContext
            .Customer
            .Include(x => x.Bookshelves)
            .SingleOrDefaultAsync(x => x.Id == Shareable.CustomerId, cancellationToken);

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
                    dbCustomer.Bookshelves.SingleOrDefault(x => x.Id == bookshelf.BookshelfId)
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
                        .FindAsync([ Shareable.Showcase.CustomerBookId ], cancellationToken)
                )
                is not { } customerBook
            )
            {
                throw new CustomerBookNotFoundException();
            }

            shareable.Showcase = new ShareableBookShowcase()
            {
                CustomerBook = customerBook,
                ShowRanking = Shareable.Showcase.ShowRanking,
                ShowComment = Shareable.Showcase.ShowComment
            };
        }

        dbContext.Shareables.Add(shareable);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

public record CommandShareable
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required string CustomerId { get; init; }
    public List<CommandBookshelf> Bookshelves { get; set; } = [ ];
    public CommandBookShowcase? Showcase { get; set; } = null;
}

public record CommandBookshelf
{
    public required Guid BookshelfId { get; init; }
    public required int Order { get; init; }
}

public record CommandBookShowcase
{
    public required Guid CustomerBookId { get; init; }
    public bool ShowRanking { get; init; } = true;
    public bool ShowComment { get; init; } = true;
}
