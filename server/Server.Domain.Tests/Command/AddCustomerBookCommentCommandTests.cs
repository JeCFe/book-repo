namespace Server.Domain.Tests.Commands;

using Microsoft.Identity.Client;
using Server.Domain.Commands;
using Server.Domain.Exceptions;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class AddCustomerBookCommentCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_throw_na_excpetion_if_customer_not_found()
    {
        using var context = fixture.CreateContext();

        await Assert.ThrowsAsync<UserNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new AddCustomerBookCommentCommand()
                    {
                        CustomerBookId = Guid.NewGuid(),
                        CustomerId = Guid.NewGuid().ToString(),
                        Comment = "Test"
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
                    new AddCustomerBookCommentCommand()
                    {
                        CustomerBookId = Guid.NewGuid(),
                        CustomerId = id,
                        Comment = "Test"
                    }
                )
        );
    }

    [Fact]
    public async void Will_update_customer_book_comment()
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
                    CustomerId = customer.Id,
                    Ranking = ranking
                }
            );
        await context.SaveChangesAsync();

        var comment = "This book is fucking great!";

        await fixture.Execute(
            context,
            new AddCustomerBookCommentCommand()
            {
                CustomerBookId = customerBookId,
                CustomerId = customer.Id,
                Comment = comment
            }
        );

        using var contextTwo = fixture.CreateContext();
        var domainCustomerBook = contextTwo.CustomerBooks.Find(customerBookId);
        Assert.NotNull(domainCustomerBook);
        Assert.Equal(comment, domainCustomerBook.Comment);
    }
}
