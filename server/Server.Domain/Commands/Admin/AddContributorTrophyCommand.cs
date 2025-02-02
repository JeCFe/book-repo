namespace Server.Domain.Commands.Admin;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Events;
using Server.Domain.Models;

public class AddContributorTrophyCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public required string PRContributed { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        var customer = await dbContext
            .Customer.Include(x => x.Trophies)
            .SingleOrDefaultAsync(x => x.Id == Id, cancellationToken);

        if (customer == null)
        {
            return;
        }

        if (customer.Trophies.Any(x => x is Contributor))
        {
            return;
        }

        await ctx.Publish(
            new GiveCustomerTrophyEvent(Id, new Contributor() { PRContributed = PRContributed }),
            cancellationToken
        );

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
