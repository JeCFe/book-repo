namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class AddBookshelfCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Does_nothing_if_customer_does_not_exist()
    {
        using var context = fixture.CreateContext();

        await fixture.Execute(
            context,
            new AddBookshelfCommand() { Id = Guid.NewGuid().ToString(), Bookshelves = ["Reading"] }
        );

        using var context2 = fixture.CreateContext();
        Assert.Empty(context2.Bookshelves.ToList());
    }

    [Fact]
    public async Task Adds_a_bookshelf_to_an_existing_customer()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync();

        await fixture.Execute(
            context,
            new AddBookshelfCommand() { Id = customerId, Bookshelves = ["Reading"] }
        );

        using var context2 = fixture.CreateContext();
        var bookshelves = context2.Bookshelves.Where(x => x.CustomerId == customerId).ToList();
        Assert.Single(bookshelves);
        Assert.Equal("Reading", bookshelves[0].Name);
    }

    [Fact]
    public async Task Adds_multiple_bookshelves_in_one_command()
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync();

        await fixture.Execute(
            context,
            new AddBookshelfCommand()
            {
                Id = customerId,
                Bookshelves = ["Reading", "Finished", "Wishlist"],
            }
        );

        using var context2 = fixture.CreateContext();
        var bookshelves = context2.Bookshelves.Where(x => x.CustomerId == customerId).ToList();
        Assert.Equal(3, bookshelves.Count);
        Assert.Contains(bookshelves, x => x.Name == "Reading");
        Assert.Contains(bookshelves, x => x.Name == "Finished");
        Assert.Contains(bookshelves, x => x.Name == "Wishlist");
    }
}
