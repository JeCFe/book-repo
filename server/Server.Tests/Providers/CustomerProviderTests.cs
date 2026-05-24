using Common.Exceptions;
using Microsoft.Extensions.Options;
using Server.Domain.Models;
using Server.Models;
using Server.Providers;
using Server.Tests.Fixtures;

namespace Server.Tests;

public class CustomerProviderTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    private readonly IOptions<BetaTestOptions> _options = Options.Create<BetaTestOptions>(
        new() { Enabled = false }
    );

    [Fact]
    public async Task Will_throw_an_exception_if_customer_not_found()
    {
        var context = fixture.CreateContext();

        var customerId = Guid.NewGuid().ToString();

        var existingCustomer = context.Customer.SingleOrDefault(x => x.Id == customerId);
        Assert.Null(existingCustomer);

        var provider = new CustomerProvider(context, _options);

        await Assert.ThrowsAsync<UserNotFoundException>(
            async () => await provider.GetCustomerSummary(customerId, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Will_get_customer_summary_if_one_already_exists()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        Customer customer = new()
        {
            Id = customerId,
            CreationDate = DateTimeOffset.UtcNow,
            Bookshelves =
            [
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
                    CreationDate = DateTimeOffset.UtcNow,
                    UpdatedDate = DateTimeOffset.UtcNow,
                },
            ],
        };
        context.Customer.Add(customer);
        context.SaveChanges();

        var provider = new CustomerProvider(context, _options);
        var actual = await provider.GetCustomerSummary(customerId, CancellationToken.None);

        Assert.NotNull(actual);
        Assert.Single(actual.Bookshelves);
        Assert.Equal(customerId, actual.Id);
    }

    [Fact]
    public async Task GetCustomerBooks_returns_empty_list_when_customer_has_no_books()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        context.SaveChanges();

        var provider = new CustomerProvider(context, _options);
        var result = await provider.GetCustomerBooks(customerId, CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetCustomerBooks_returns_all_books_for_customer()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        var customer = new Customer { Id = customerId, CreationDate = DateTimeOffset.UtcNow };
        var bookA = new Book { Isbn = "ISBN-A", Name = "Book A" };
        var bookB = new Book { Isbn = "ISBN-B", Name = "Book B" };
        context.Customer.Add(customer);
        context.Books.AddRange(bookA, bookB);
        context.CustomerBooks.AddRange(
            new CustomerBook
            {
                Id = Guid.NewGuid(),
                Isbn = bookA.Isbn,
                Book = bookA,
                Customer = customer,
                CustomerId = customerId,
            },
            new CustomerBook
            {
                Id = Guid.NewGuid(),
                Isbn = bookB.Isbn,
                Book = bookB,
                Customer = customer,
                CustomerId = customerId,
            }
        );
        context.SaveChanges();

        var provider = new CustomerProvider(context, _options);
        var result = await provider.GetCustomerBooks(customerId, CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Contains(result, x => x.Book.Isbn == bookA.Isbn);
        Assert.Contains(result, x => x.Book.Isbn == bookB.Isbn);
    }

    [Fact]
    public async Task GetCustomerBook_returns_null_when_not_found()
    {
        var context = fixture.CreateContext();

        var provider = new CustomerProvider(context, _options);
        var result = await provider.GetCustomerBook(
            Guid.NewGuid(),
            Guid.NewGuid().ToString(),
            CancellationToken.None
        );

        Assert.Null(result);
    }

    [Fact]
    public async Task GetCustomerBook_returns_book_with_correct_data()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        var customerBookId = Guid.NewGuid();
        var customer = new Customer { Id = customerId, CreationDate = DateTimeOffset.UtcNow };
        var book = new Book { Isbn = "ISBN-1", Name = "My Book" };
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.CustomerBooks.Add(
            new CustomerBook
            {
                Id = customerBookId,
                Isbn = book.Isbn,
                Book = book,
                Customer = customer,
                CustomerId = customerId,
                Ranking = 4,
                Comment = "Great read",
            }
        );
        context.SaveChanges();

        var provider = new CustomerProvider(context, _options);
        var result = await provider.GetCustomerBook(
            customerBookId,
            customerId,
            CancellationToken.None
        );

        Assert.NotNull(result);
        Assert.Equal(customerBookId, result.Id);
        Assert.Equal(4, result.Ranking);
        Assert.Equal("Great read", result.Comment);
        Assert.Equal("ISBN-1", result.Book.Isbn);
    }
}
