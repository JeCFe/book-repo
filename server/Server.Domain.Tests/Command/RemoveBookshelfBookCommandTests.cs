namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class RemoveBookshelfBookCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_successfully_remove_book()
    {
        var id = Guid.NewGuid();

        var customer = new Customer() { Id = id.ToString(), CreationDate = DateTimeOffset.UtcNow };

        var bookshelf = new Bookshelf()
        {
            Id = id,
            Name = "Homeless books",
            CreationDate = DateTimeOffset.UtcNow,
        };

        customer.Bookshelves = [bookshelf];

        var book = new Book() { Isbn = id.ToString(), Name = "This is a test" };
        var customerBook = new CustomerBook()
        {
            Id = Guid.NewGuid(),
            Book = book,
            Isbn = book.Isbn,
            CustomerId = customer.Id,
            Customer = customer,
        };
        var bookshelfBook = new BookshelfBook()
        {
            CustomerBook = customerBook,
            CustomerBookId = customerBook.Id,
            Bookshelf = bookshelf,
            Isbn = book.Isbn,
            BookshelfId = bookshelf.Id,
            Order = 0,
        };

        using var context = fixture.CreateContext();
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.BookshelfBook.Add(bookshelfBook);
        context.SaveChanges();

        var amount = await fixture.Execute(
            context,
            new RemoveBookshelfBookCommand()
            {
                CustomerId = id.ToString(),
                Isbn = id.ToString(),
                BookshelfId = id,
            }
        );

        using var context2 = fixture.CreateContext();
        var bookshelfBooks = context2
            .BookshelfBook.Where(x => x.BookshelfId == id && x.Isbn == id.ToString())
            .ToList();

        Assert.Empty(bookshelfBooks);
        Assert.Equal(1, amount);
    }
}
