namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class RemoveBookshelfCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_remove_bookshelf_and_book()
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
            Isbn = book.Isbn,
            CustomerBook = customerBook,
            CustomerBookId = customerBook.Id,
            Bookshelf = bookshelf,
            BookshelfId = bookshelf.Id,
            Order = 1,
        };

        using var context = fixture.CreateContext();
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.BookshelfBook.Add(bookshelfBook);
        context.SaveChanges();

        await fixture.Execute(
            context,
            new RemoveBookshelfCommand() { Id = id.ToString(), BookshelfId = id }
        );

        using var context2 = fixture.CreateContext();
        var bookshelfBooks = context2
            .BookshelfBook.Where(x => x.BookshelfId == id && x.Isbn == id.ToString())
            .ToList();
        var domainBookshelf = context2.Bookshelves.Find(bookshelf.Id);

        Assert.Empty(bookshelfBooks);
        Assert.Null(domainBookshelf);
    }
}
