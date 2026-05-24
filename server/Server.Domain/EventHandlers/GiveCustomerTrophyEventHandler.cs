using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Events;

namespace Server.Domain.EventHandlers;

public class GiveCustomerTrophyEventHandler(BookRepoContext context)
    : INotificationHandler<GiveCustomerTrophyEvent>
{
    public async Task Handle(
        GiveCustomerTrophyEvent notification,
        CancellationToken cancellationToken
    )
    {
        var customer = await context.Customer
            .Include(x => x.Trophies)
            .SingleOrDefaultAsync(x => x.Id == notification.CustomerId, cancellationToken);

        if (customer is null)
        {
            return;
        }

        if (!notification.Trophy.CheckApproval())
        {
            return;
        }

        if (customer.Trophies.Any(t => t.GetType() == notification.Trophy.GetType()))
        {
            return;
        }

        customer.Trophies.Add(notification.Trophy);
        await context.SaveChangesAsync(cancellationToken);
    }
}
