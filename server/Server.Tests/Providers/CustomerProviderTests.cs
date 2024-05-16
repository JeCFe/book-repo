using Moq;
using Server.Domain.Models;
using Server.Exceptions;
using Server.Providers;
using Server.Tests.Fixtures;

namespace Server.Tests;

public class CustomerProviderTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Will_throw_an_exception_if_customer_not_found()
    {
        var context = fixture.CreateContext();

        var customerId = Guid.NewGuid().ToString();

        var existingCustomer = context.Customer.SingleOrDefault(x => x.Id == customerId);
        Assert.Null(existingCustomer);

        var provider = new CustomerProvider(context);

        await Assert.ThrowsAsync<UserNotFoundException>(
            async () => await provider.GetCustomerSummary(customerId, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Will_get_customer_summary_if_one_already_exists()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        Customer customer =
            new()
            {
                Id = customerId,
                CreationDate = DateTimeOffset.UtcNow,
                Bookshelves =
                [
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
                    CreationDate = DateTimeOffset.UtcNow,
                    UpdatedDate = DateTimeOffset.UtcNow,
                    
                },
                ]
            };
        context.Customer.Add(customer);
        context.SaveChanges();

        var provider = new CustomerProvider(context);
        var actual = await provider.GetCustomerSummary(customerId, CancellationToken.None);

        Assert.NotNull(actual);
        Assert.Single(actual.Bookshelves);
        Assert.Equal(customerId, actual.Id);
    }
}
