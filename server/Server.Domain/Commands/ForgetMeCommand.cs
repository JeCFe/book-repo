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
        await context
            .Customer
            .Where(x => x.CustomerId == CustomerId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
