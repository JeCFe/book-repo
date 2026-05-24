namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class ForgetMeCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_delete_a_customer_and_all_their_shelves()
    {
        var id = Guid.NewGuid().ToString();
        var customer = new Customer()
        {
            Id = id,
            CreationDate = DateTimeOffset.UtcNow,
            Bookshelves =
            [
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = Faker.Internet.UserName(),
                    CreationDate = DateTimeOffset.UtcNow,
                    UpdatedDate = DateTimeOffset.UtcNow,
                },
            ],
        };

        using var context = fixture.CreateContext();
        context.Customers.Add(customer);
        context.SaveChanges();

        Assert.Equivalent(customer, context.Customers.Find([customer.Id]));

        await fixture.Execute(context, new ForgetMeCommand() { Id = id });

        using var context2 = fixture.CreateContext();

        Assert.Null(context2.Customers.Find([customer.Id]));
        Assert.Empty(context2.Bookshelves.Where(x => x.CustomerId == customer.Id));
    }
}
