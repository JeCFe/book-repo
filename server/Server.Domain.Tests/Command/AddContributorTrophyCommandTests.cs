namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands.Admin;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class AddContributorTrophyCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Does_nothing_if_customer_does_not_exist()
    {
        using var context = fixture.CreateContext();

        await fixture.Execute(
            context,
            new AddContributorTrophyCommand
            {
                Id = Guid.NewGuid().ToString(),
                PRContributed = "https://github.com/example/pr/1",
            }
        );

        using var context2 = fixture.CreateContext();
        Assert.Empty(context2.Trophies.OfType<Contributor>().ToList());
    }

    [Fact]
    public async Task Completes_without_error_for_customer_with_no_existing_contributor_trophy()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync();

        // Publisher is mocked so the trophy won't be saved, but the command should not throw
        var exception = await Record.ExceptionAsync(
            async () =>
                await fixture.Execute(
                    context,
                    new AddContributorTrophyCommand
                    {
                        Id = customerId,
                        PRContributed = "https://github.com/example/pr/1",
                    }
                )
        );

        Assert.Null(exception);
    }

    [Fact]
    public async Task Does_not_publish_when_customer_already_has_contributor_trophy()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        var customer = new Customer { Id = customerId, CreationDate = DateTimeOffset.UtcNow };
        customer.Trophies.Add(
            new Contributor { PRContributed = "https://github.com/example/pr/1" }
        );
        context.Customers.Add(customer);
        await context.SaveChangesAsync();

        // Running the command when a Contributor trophy already exists should return early
        var exception = await Record.ExceptionAsync(
            async () =>
                await fixture.Execute(
                    context,
                    new AddContributorTrophyCommand
                    {
                        Id = customerId,
                        PRContributed = "https://github.com/example/pr/2",
                    }
                )
        );

        Assert.Null(exception);
        using var context2 = fixture.CreateContext();
        Assert.Single(context2.Trophies.OfType<Contributor>().ToList());
    }
}
