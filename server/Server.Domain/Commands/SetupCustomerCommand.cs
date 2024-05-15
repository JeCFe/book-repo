namespace Server.Domain.Commands;

using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class SetupCustomerCommand : ICommand
{
    public required string Id { get; init; }
    public bool HasDefaultBookshelves { get; init; }

    public async Task Execute(
        BookRepoContext context,
        IPublisher publisher,
        CancellationToken cancellationToken
    )
    {
        throw new NotImplementedException();
    }
}
