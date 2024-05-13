namespace Server.Domain.Commands;

using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class ForgetMeCommand : ICommand
{
    public required string CustomerId { get; init; }

    public async Task Execute(
        BookRepoContext context,
        IPublisher publisher,
        CancellationToken cancellationToken
    )
    {
        var customer = context.Customer.SingleOrDefault(x => x.CustomerId == CustomerId);
        if (customer is not { })
        {
            return;
        }

        await context
            .Bookshelves
            .Where(x => x.CustomerId == customer.Id)
            .ExecuteDeleteAsync(cancellationToken);

        await context
            .Customer
            .Where(x => x.CustomerId == customer.CustomerId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
