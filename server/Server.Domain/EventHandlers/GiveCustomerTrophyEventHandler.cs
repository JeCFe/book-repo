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
        if (
            (await context.Customer.FindAsync([ notification.CustomerId ], cancellationToken))
            is not { } customer
        )
        {
            return;
        }

        if (!notification.Trophy.CheckApproval())
        {
            return;
        }

        customer.Trophies.Add(notification.Trophy);
        await context.SaveChangesAsync(cancellationToken);
    }
}
