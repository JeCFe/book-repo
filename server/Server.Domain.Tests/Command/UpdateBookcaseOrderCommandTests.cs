namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class UpdateBookcaseOrderCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Updates_order_of_books_in_bookshelf()
    {
        using var context = fixture.CreateContext();
        var customer = new Customer
        {
            Id = Guid.NewGuid().ToString(),
            CreationDate = DateTimeOffset.UtcNow,
        };
        var bookshelfId = Guid.NewGuid();
        var bookshelf = new Bookshelf
        {
            Id = bookshelfId,
            Name = "Reading",
            CustomerId = customer.Id,
            CreationDate = DateTimeOffset.UtcNow,
        };

        var bookA = new Book { Isbn = "ISBN-A", Name = "Book A" };
        var bookB = new Book { Isbn = "ISBN-B", Name = "Book B" };

        var customerBookA = new CustomerBook
        {
            Id = Guid.NewGuid(),
            Isbn = bookA.Isbn,
            Book = bookA,
            Customer = customer,
            CustomerId = customer.Id,
        };
        var customerBookB = new CustomerBook
        {
            Id = Guid.NewGuid(),
            Isbn = bookB.Isbn,
            Book = bookB,
            Customer = customer,
            CustomerId = customer.Id,
        };

        context.Customer.Add(customer);
        context.Books.AddRange(bookA, bookB);
        context.CustomerBooks.AddRange(customerBookA, customerBookB);
        context.BookshelfBook.AddRange(
            new BookshelfBook
            {
                BookshelfId = bookshelfId,
                CustomerBookId = customerBookA.Id,
                Isbn = bookA.Isbn,
                Order = 0,
                Bookshelf = bookshelf,
                CustomerBook = customerBookA,
            },
            new BookshelfBook
            {
                BookshelfId = bookshelfId,
                CustomerBookId = customerBookB.Id,
                Isbn = bookB.Isbn,
                Order = 1,
                Bookshelf = bookshelf,
                CustomerBook = customerBookB,
            }
        );
        await context.SaveChangesAsync();

        await fixture.Execute(
            context,
            new UpdateBookcaseOrderCommand
            {
                CustomerId = customer.Id,
                BookshelfId = bookshelfId,
                Books =
                [
                    new UpdateBook { Isbn = bookA.Isbn, Order = 5 },
                    new UpdateBook { Isbn = bookB.Isbn, Order = 2 },
                ],
            }
        );

        using var context2 = fixture.CreateContext();
        var entries = context2.BookshelfBook.Where(x => x.BookshelfId == bookshelfId).ToList();
        Assert.Equal(5, entries.Single(x => x.Isbn == bookA.Isbn).Order);
        Assert.Equal(2, entries.Single(x => x.Isbn == bookB.Isbn).Order);
    }
}
