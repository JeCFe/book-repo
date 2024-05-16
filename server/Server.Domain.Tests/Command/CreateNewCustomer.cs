namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class CreateNewCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_set_up_new_customer_with_default_bookshelves()
    {
        var id = Guid.NewGuid().ToString();

        using var context = fixture.CreateContext();

        await fixture.Execute(
            context,
            new SetupCustomerCommand() { Id = id, IncludeDefaultBookshelves = true }
        );

        using var context2 = fixture.CreateContext();

        Assert.NotNull(context2.Customer.Find([ id ]));
        Assert.Equal(3, context2.Bookshelves.Where(x => x.CustomerId == id).ToList().Count);
    }

    [Fact]
    public async void Will_set_up_new_customer_without_bookshelves()
    {
        var id = Guid.NewGuid().ToString();

        using var context = fixture.CreateContext();

        await fixture.Execute(context, new SetupCustomerCommand() { Id = id });

        using var context2 = fixture.CreateContext();

        Assert.NotNull(context2.Customer.Find([ id ]));
        Assert.Empty(context2.Bookshelves.Where(x => x.CustomerId == id));
    }
}
