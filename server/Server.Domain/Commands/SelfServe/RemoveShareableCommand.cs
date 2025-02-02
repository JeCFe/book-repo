namespace Server.Domain.Commands;

using Common.Exceptions;
using Common.MediatR;
using Server.Domain;

public class RemoveShareableCommand : ICommand<BookRepoContext>
{
    public required Guid Id { get; init; }
    public required string CustomerId { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        var dbCustomer = await dbContext.Customer.FindAsync([CustomerId], cancellationToken);

        if (dbCustomer is not { } customer)
        {
            throw new UserNotFoundException();
        }

        if ((await dbContext.Shareables.FindAsync([Id], cancellationToken)) is not { } shareable)
        {
            return;
        }
        dbContext.Shareables.Remove(shareable);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
