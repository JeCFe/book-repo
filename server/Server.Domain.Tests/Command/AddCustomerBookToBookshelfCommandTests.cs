namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class AddCustomerBookToBookshelfCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    private static (Customer customer, Book book, Bookshelf bookshelf, CustomerBook customerBook) Seed(
        BookRepoContext context
    )
    {
        var customer = new Customer { Id = Guid.NewGuid().ToString(), CreationDate = DateTimeOffset.UtcNow };
        var book = new Book { Isbn = Guid.NewGuid().ToString(), Name = "Test Book" };
        var bookshelf = new Bookshelf
        {
            Id = Guid.NewGuid(),
            Name = "Reading",
            CustomerId = customer.Id,
            CreationDate = DateTimeOffset.UtcNow,
        };
        var customerBook = new CustomerBook
        {
            Id = Guid.NewGuid(),
            Isbn = book.Isbn,
            Book = book,
            Customer = customer,
            CustomerId = customer.Id,
        };
        customer.Bookshelves = [bookshelf];
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.CustomerBooks.Add(customerBook);
        context.SaveChanges();
        return (customer, book, bookshelf, customerBook);
    }

    [Fact]
    public async Task Throws_CustomerBookNotFoundException_when_customer_book_not_found()
    {
        using var context = fixture.CreateContext();
        var customer = new Customer { Id = Guid.NewGuid().ToString(), CreationDate = DateTimeOffset.UtcNow };
        var bookshelf = new Bookshelf { Id = Guid.NewGuid(), Name = "Reading", CustomerId = customer.Id, CreationDate = DateTimeOffset.UtcNow };
        customer.Bookshelves = [bookshelf];
        context.Customer.Add(customer);
        await context.SaveChangesAsync();

        await Assert.ThrowsAsync<CustomerBookNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new AddCustomerBookToBookshelfCommand
                    {
                        CustomerBookId = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        BookshelfId = bookshelf.Id,
                    }
                )
        );
    }

    [Fact]
    public async Task Throws_BookshelfNotFound_when_bookshelf_not_found()
    {
        using var context = fixture.CreateContext();
        var customer = new Customer { Id = Guid.NewGuid().ToString(), CreationDate = DateTimeOffset.UtcNow };
        var book = new Book { Isbn = Guid.NewGuid().ToString(), Name = "Test Book" };
        var customerBook = new CustomerBook { Id = Guid.NewGuid(), Isbn = book.Isbn, Book = book, Customer = customer, CustomerId = customer.Id };
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.CustomerBooks.Add(customerBook);
        await context.SaveChangesAsync();

        await Assert.ThrowsAsync<BookshelfNotFound>(
            async () =>
                await fixture.Execute(
                    context,
                    new AddCustomerBookToBookshelfCommand
                    {
                        CustomerBookId = customerBook.Id,
                        CustomerId = customer.Id,
                        BookshelfId = Guid.NewGuid(),
                    }
                )
        );
    }

    [Fact]
    public async Task Adds_book_to_bookshelf()
    {
        using var context = fixture.CreateContext();
        var (customer, _, bookshelf, customerBook) = Seed(context);

        await fixture.Execute(
            context,
            new AddCustomerBookToBookshelfCommand
            {
                CustomerBookId = customerBook.Id,
                CustomerId = customer.Id,
                BookshelfId = bookshelf.Id,
            }
        );

        using var context2 = fixture.CreateContext();
        Assert.Single(
            context2.BookshelfBook.Where(x =>
                x.BookshelfId == bookshelf.Id && x.CustomerBookId == customerBook.Id
            )
        );
    }

    [Fact]
    public async Task Does_not_add_duplicate_when_book_already_in_bookshelf()
    {
        using var context = fixture.CreateContext();
        var (customer, book, bookshelf, customerBook) = Seed(context);
        context.BookshelfBook.Add(new BookshelfBook
        {
            BookshelfId = bookshelf.Id,
            CustomerBookId = customerBook.Id,
            Isbn = book.Isbn,
            Order = 0,
            Bookshelf = bookshelf,
            CustomerBook = customerBook,
        });
        await context.SaveChangesAsync();

        await fixture.Execute(
            context,
            new AddCustomerBookToBookshelfCommand
            {
                CustomerBookId = customerBook.Id,
                CustomerId = customer.Id,
                BookshelfId = bookshelf.Id,
            }
        );

        using var context2 = fixture.CreateContext();
        Assert.Single(
            context2.BookshelfBook.Where(x =>
                x.BookshelfId == bookshelf.Id && x.CustomerBookId == customerBook.Id
            )
        );
    }
}
