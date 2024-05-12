using Moq;
using Server.Domain.Models;
using Server.Helpers;
using Server.Providers;
using Server.Tests.Fixtures;

namespace Server.Tests;

public class CustomerProviderTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Will_create_new_customer_account_if_one_did_not_exist_before()
    {
        var context = fixture.CreateContext();
        var clockMock = new Mock<IClock>();
        clockMock.Setup(x => x.UtcNow).Returns(DateTimeOffset.UtcNow);

        var customerId = Guid.NewGuid().ToString();

        var existingCustomer = context.Customer.SingleOrDefault(x => x.CustomerId == customerId);
        Assert.Null(existingCustomer);

        var provider = new CustomerProvider(clockMock.Object, context);
        var actual = await provider.GetCustomerSummary(customerId, CancellationToken.None);

        Assert.NotNull(actual);
        Assert.Equal(clockMock.Object.UtcNow, actual.CreatedOn);
        Assert.Equal(3, actual.Bookshelves.Count);

        var savedCustomer = context.Customer.SingleOrDefault(x => x.CustomerId == customerId);
        Assert.NotNull(savedCustomer);
    }

    [Fact]
    public async Task Will_get_customer_summary_if_one_already_exists()
    {
        var context = fixture.CreateContext();
        var clockMock = new Mock<IClock>();
        clockMock.Setup(x => x.UtcNow).Returns(DateTimeOffset.UtcNow);
        var customerId = Guid.NewGuid().ToString();
        Customer customer =
            new()
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                CreationDate = clockMock.Object.UtcNow,
                Bookshelves =
                [
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
                    Books = [],
                    CreationDate = clockMock.Object.UtcNow,
                    UpdatedDate = clockMock.Object.UtcNow,
                    
                },
                ]
            };
        context.Customer.Add(customer);
        context.SaveChanges();

        var provider = new CustomerProvider(clockMock.Object, context);
        var actual = await provider.GetCustomerSummary(customerId, CancellationToken.None);

        Assert.NotNull(actual);
        Assert.Equal(clockMock.Object.UtcNow, actual.CreatedOn);
        Assert.Single(actual.Bookshelves);
    }

    [Fact]
    public async Task Will_setup_new_customer_account_with_default_bookshelves()
    {
        var context = fixture.CreateContext();
        var clockMock = new Mock<IClock>();
        clockMock.Setup(x => x.UtcNow).Returns(DateTimeOffset.UtcNow);
        var customerId = Guid.NewGuid().ToString();

        Customer expected =
            new()
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                CreationDate = clockMock.Object.UtcNow,
                Bookshelves =
                [
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
                    Books = [],
                    CreationDate = clockMock.Object.UtcNow,
                    UpdatedDate = clockMock.Object.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Currently Reading",
                    Books = [],
                    CreationDate = clockMock.Object.UtcNow,
                    UpdatedDate = clockMock.Object.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Read",
                    Books = [],
                    CreationDate = clockMock.Object.UtcNow,
                    UpdatedDate = clockMock.Object.UtcNow,
                    
                },
                ]
            };

        var provider = new CustomerProvider(clockMock.Object, context);
        var actual = await provider.SetupNewCustomerAccount(customerId, CancellationToken.None);

        Assert.NotNull(actual);
        Assert.Equivalent(expected, actual);
    }
}
