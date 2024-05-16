namespace Server.Domain.Commands;

using MediatR;
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
        if (await dbContext.Customer.FindAsync([ Id ], cancellationToken) is not { } customer)
        {
            return;
        }

        var x = await dbContext
            .Bookshelves
            .Where(x => x.CustomerId == Id)
            .ExecuteDeleteAsync(cancellationToken);

        var y = await dbContext
            .Customer
            .Where(x => x.Id == customer.Id)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
