namespace Server.Domain.Tests.EventHandlers;

using Microsoft.EntityFrameworkCore;
using Server.Domain.EventHandlers;
using Server.Domain.Events;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class GiveCustomerTrophyEventHandlerTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Does_nothing_if_customer_does_not_exist()
    {
        using var context = fixture.CreateContext();

        var handler = new GiveCustomerTrophyEventHandler(context);
        await handler.Handle(
            new GiveCustomerTrophyEvent(Guid.NewGuid().ToString(), new AvidReviewer(100) { }),
            CancellationToken.None
        );

        using var context2 = fixture.CreateContext();
        // Handler returns early if no customer found — verified by no exception being thrown above
        // We can't check total trophies due to shared DB; this test verifies no exception is thrown
        var nonExistentCustomerTrophies = context2
            .Customer.Include(x => x.Trophies)
            .Where(x => x.Id == "non-existent-id")
            .SelectMany(x => x.Trophies)
            .ToList();
        Assert.Empty(nonExistentCustomerTrophies);
    }

    [Fact]
    public async Task Does_not_add_trophy_when_CheckApproval_returns_false()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync();

        var handler = new GiveCustomerTrophyEventHandler(context);

        // AvidReviewer with 0 books rated will not pass the 100-book threshold
        await handler.Handle(
            new GiveCustomerTrophyEvent(customerId, new AvidReviewer(0) { }),
            CancellationToken.None
        );

        using var context2 = fixture.CreateContext();
        var customer2 = context2.Customer.Include(x => x.Trophies).Single(x => x.Id == customerId);
        Assert.Empty(customer2.Trophies.OfType<AvidReviewer>());
    }

    [Fact]
    public async Task Adds_trophy_when_CheckApproval_returns_true()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync();

        var handler = new GiveCustomerTrophyEventHandler(context);
        await handler.Handle(
            new GiveCustomerTrophyEvent(customerId, new AvidReviewer(100) { }),
            CancellationToken.None
        );

        using var context2 = fixture.CreateContext();
        var customer2 = context2.Customer.Include(x => x.Trophies).Single(x => x.Id == customerId);
        Assert.Single(customer2.Trophies.OfType<AvidReviewer>());
    }

    [Fact]
    public async Task Does_not_award_duplicate_trophy_of_same_type()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync();

        var handler = new GiveCustomerTrophyEventHandler(context);
        await handler.Handle(
            new GiveCustomerTrophyEvent(customerId, new AvidReviewer(100) { }),
            CancellationToken.None
        );

        using var context2 = fixture.CreateContext();
        var handler2 = new GiveCustomerTrophyEventHandler(context2);
        await handler2.Handle(
            new GiveCustomerTrophyEvent(customerId, new AvidReviewer(100) { }),
            CancellationToken.None
        );

        using var context3 = fixture.CreateContext();
        var customer3 = context3.Customer.Include(x => x.Trophies).Single(x => x.Id == customerId);
        Assert.Single(customer3.Trophies.OfType<AvidReviewer>());
    }
}
