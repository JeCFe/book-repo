namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Microsoft.Identity.Client;
using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class RateCustomrBooksCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_throw_na_excpetion_if_customer_not_found()
    {
        using var context = fixture.CreateContext();

        await Assert.ThrowsAsync<UserNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new RateCustomerBookCommand()
                    {
                        CustomerBookId = Guid.NewGuid(),
                        CustomerId = Guid.NewGuid().ToString(),
                        Ranking = 1
                    }
                )
        );
    }

    [Fact]
    public async void Will_throw_na_excpetion_if_customer_book_not_found()
    {
        using var context = fixture.CreateContext();
        var id = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = id, CreationDate = DateTime.UtcNow });
        await context.SaveChangesAsync();

        await Assert.ThrowsAsync<CustomerBookNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new RateCustomerBookCommand()
                    {
                        CustomerBookId = Guid.NewGuid(),
                        CustomerId = id,
                        Ranking = 1
                    }
                )
        );
    }

    [Fact]
    public async void Will_update_customer_book_ranking()
    {
        using var context = fixture.CreateContext();
        var ranking = 5;
        var customerBookId = Guid.NewGuid();
        Customer customer =
            new() { Id = Guid.NewGuid().ToString(), CreationDate = DateTime.UtcNow };
        Book book = new() { Isbn = Guid.NewGuid().ToString(), Name = "Test book" };

        context.Customer.Add(customer);
        context.Books.Add(book);
        context
            .CustomerBooks
            .Add(
                new()
                {
                    Id = customerBookId,
                    Book = book,
                    Isbn = book.Isbn,
                    Customer = customer,
                    CustomerId = customer.Id
                }
            );
        await context.SaveChangesAsync();

        await fixture.Execute(
            context,
            new RateCustomerBookCommand()
            {
                CustomerBookId = customerBookId,
                CustomerId = customer.Id,
                Ranking = ranking
            }
        );

        using var contextTwo = fixture.CreateContext();
        var domainCustomerBook = contextTwo.CustomerBooks.Find(customerBookId);
        Assert.NotNull(domainCustomerBook);
        Assert.Equal(ranking, domainCustomerBook.Ranking);
    }
}
