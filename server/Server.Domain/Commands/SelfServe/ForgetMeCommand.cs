namespace Server.Domain.Commands;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class ForgetMeCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (await dbContext.Customers.FindAsync([Id], cancellationToken) is not { } customer)
        {
            return;
        }

        _ = await dbContext
            .Bookshelves.Where(x => x.CustomerId == Id)
            .ExecuteDeleteAsync(cancellationToken);

        _ = await dbContext
            .Customers.Where(x => x.Id == customer.Id)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
