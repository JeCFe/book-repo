namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Microsoft.Identity.Client;
using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class AddShareableCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_throw_an_excpetion_if_customer_not_found()
    {
        using var context = fixture.CreateContext();

        await Assert.ThrowsAsync<UserNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new AddShareableCommand()
                    {
                        Shareable = new CommandShareable()
                        {
                            Id = Guid.NewGuid(),
                            Title = "Test",
                            CustomerId = Guid.NewGuid().ToString()
                        }
                    }
                )
        );
    }

    [Fact]
    public async void Will_throw_an_excpetion_if_bookshelf_doesnt_exist()
    {
        var context = fixture.CreateContext();
        var id = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = id, CreationDate = DateTime.UtcNow });
        context.SaveChanges();

        var context2 = fixture.CreateContext();
        await Assert.ThrowsAsync<BookshelfNotFound>(
            async () =>
                await fixture.Execute(
                    context2,
                    new AddShareableCommand()
                    {
                        Shareable = new CommandShareable()
                        {
                            Id = Guid.NewGuid(),
                            Title = "Test",
                            CustomerId = id,
                            Bookshelves = new()
                            {
                                new CommandBookshelf() { BookshelfId = Guid.NewGuid(), Order = 1 }
                            }
                        }
                    }
                )
        );
    }

    [Fact]
    public async void Will_throw_an_excpetion_if_customer_book_doesnt_exist()
    {
        using var context = fixture.CreateContext();
        var id = Guid.NewGuid().ToString();
        context.Customer.Add(new() { Id = id, CreationDate = DateTime.UtcNow });
        context.SaveChanges();
        context.SaveChanges();

        await Assert.ThrowsAsync<CustomerBookNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new AddShareableCommand()
                    {
                        Shareable = new()
                        {
                            CustomerId = id,
                            Title = "Test",
                            Id = Guid.NewGuid(),
                            Showcase = new CommandBookShowcase()
                            {
                                CustomerBookId = Guid.NewGuid(),
                            }
                        }
                    }
                )
        );
    }

    [Fact]
    public async void Will_successfully_add_shareable_with_title()
    {
        using var context = fixture.CreateContext();
        var id = Guid.NewGuid().ToString();
        var shareId = Guid.NewGuid();
        context.Customer.Add(new() { Id = id, CreationDate = DateTime.UtcNow });
        context.SaveChanges();

        await fixture.Execute(
            context,
            new AddShareableCommand()
            {
                Shareable = new()
                {
                    CustomerId = id,
                    Title = "Test",
                    Id = shareId,
                }
            }
        );

        var shareable = context.Shareables.FirstOrDefault(x => x.Id == shareId);
        Assert.NotNull(shareable);
    }

    [Fact]
    public async void Will_successfully_add_shareable_with_bookshelf()
    {
        using var context = fixture.CreateContext();
        var id = Guid.NewGuid().ToString();
        var shareId = Guid.NewGuid();
        var bookshelfId = Guid.NewGuid();
        context.Customer.Add(new() { Id = id, CreationDate = DateTime.UtcNow });
        context
            .Bookshelves
            .Add(
                new()
                {
                    Id = bookshelfId,
                    Name = "Test",
                    CustomerId = id
                }
            );
        context.SaveChanges();

        await fixture.Execute(
            context,
            new AddShareableCommand()
            {
                Shareable = new()
                {
                    CustomerId = id,
                    Title = "Test",
                    Id = shareId,
                    Bookshelves =  [ new() {BookshelfId = bookshelfId, Order = 1 } ]
                }
            }
        );

        var shareable = context.Shareables.FirstOrDefault(x => x.Id == shareId);
        Assert.NotNull(shareable);
        Assert.Single(shareable.Bookshelves);
    }

    [Fact]
    public async void Will_successfully_add_shareable_with_book_showcase()
    {
        var customerBookId = Guid.NewGuid();
        var id = Guid.NewGuid().ToString();
        var shareId = Guid.NewGuid();
        var customer = new Customer() { Id = id, CreationDate = DateTime.UtcNow };

        var book = new Book() { Isbn = Guid.NewGuid().ToString(), Name = "Test" };
        var customerBook = new CustomerBook()
        {
            Book = book,
            Customer = customer,
            Id = customerBookId,
            Isbn = book.Isbn,
            CustomerId = customer.Id
        };
        using var context = fixture.CreateContext();
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.CustomerBooks.Add(customerBook);
        context.SaveChanges();

        await fixture.Execute(
            context,
            new AddShareableCommand()
            {
                Shareable = new()
                {
                    CustomerId = id,
                    Title = "Test",
                    Id = shareId,
                    Showcase = new() { CustomerBookId = customerBookId }
                }
            }
        );

        var shareable = context.Shareables.FirstOrDefault(x => x.Id == shareId);
        Assert.NotNull(shareable);
        Assert.NotNull(shareable.Showcase);
    }
}
