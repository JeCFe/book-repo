namespace Server.Domain.Commands;

using Server.Domain;
using Server.Domain.Exceptions;

public class RateCustomerBookCommand : ICommand<BookRepoContext>
{
    public required Guid CustomerBookId { get; init; }
    public required string CustomerId { get; init; }
    public required int Ranking { get; init; } //TODO: Make a type or enum to ensure a fixed range?

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (await dbContext.Customer.FindAsync([ CustomerId ], cancellationToken) is not { })
        {
            throw new UserNotFoundException();
        }

        if (
            await dbContext.CustomerBooks.FindAsync([ CustomerBookId ], cancellationToken)
            is not { } customerBook
        )
        {
            throw new CustomerBookNotFoundException();
        }

        customerBook.Ranking = Ranking;
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
