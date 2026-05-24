namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class RemoveShareableCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Throws_UserNotFoundException_when_customer_not_found()
    {
        using var context = fixture.CreateContext();

        await Assert.ThrowsAsync<UserNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new RemoveShareableCommand
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = Guid.NewGuid().ToString(),
                    }
                )
        );
    }

    [Fact]
    public async Task Does_nothing_when_shareable_not_found()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync();

        await fixture.Execute(
            context,
            new RemoveShareableCommand { Id = Guid.NewGuid(), CustomerId = customerId }
        );

        using var context2 = fixture.CreateContext();
        Assert.Empty(context2.Shareables.ToList());
    }

    [Fact]
    public async Task Removes_shareable_when_found()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        var customer = new Customer { Id = customerId, CreationDate = DateTimeOffset.UtcNow };
        var shareableId = Guid.NewGuid();
        var shareable = new Shareable
        {
            Id = shareableId,
            Title = "My List",
            Customer = customer,
        };
        context.Customer.Add(customer);
        context.Shareables.Add(shareable);
        await context.SaveChangesAsync();

        await fixture.Execute(
            context,
            new RemoveShareableCommand { Id = shareableId, CustomerId = customerId }
        );

        using var context2 = fixture.CreateContext();
        Assert.Null(context2.Shareables.Find(shareableId));
    }
}
