namespace Server.Domain.Commands;

using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class ForgetMeCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }

    public async Task Execute(
        BookRepoContext context,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (await context.Customer.FindAsync([ Id ], cancellationToken) is not { } customer)
        {
            return;
        }

        var x = await context
            .Bookshelves
            .Where(x => x.CustomerId == Id)
            .ExecuteDeleteAsync(cancellationToken);

        var y = await context
            .Customer
            .Where(x => x.Id == customer.Id)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
