namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class AddBookshelfBookCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_add_a_new_book_to_a_single_bookshelf()
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

        using var context = fixture.CreateContext();
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.SaveChanges();

        await fixture.Execute(
            context,
            new AddBookshelfBookCommand()
            {
                Id = id.ToString(),
                Isbn = id.ToString(),
                BookshelfId = [id],
            }
        );

        using var context2 = fixture.CreateContext();
        var bookshelfBooks = context2
            .BookshelfBook.Where(x => x.BookshelfId == id && x.Isbn == id.ToString())
            .ToList();

        Assert.NotNull(bookshelfBooks);
        Assert.Single(bookshelfBooks);
    }

    [Fact]
    public async void Will_add_a_new_book_to_multiple_bookshelves()
    {
        var id = Guid.NewGuid();
        var idB = Guid.NewGuid();

        var customer = new Customer() { Id = id.ToString(), CreationDate = DateTimeOffset.UtcNow };

        var bookshelfA = new Bookshelf()
        {
            Id = id,
            Name = "Homeless books",
            CreationDate = DateTimeOffset.UtcNow,
        };

        var bookshelfB = new Bookshelf()
        {
            Id = idB,
            Name = "Beautiful books",
            CreationDate = DateTimeOffset.UtcNow,
        };

        customer.Bookshelves = [bookshelfA, bookshelfB];

        var book = new Book() { Isbn = id.ToString(), Name = "This is a test" };

        using var context = fixture.CreateContext();
        context.Customer.Add(customer);
        context.Books.Add(book);
        context.SaveChanges();

        await fixture.Execute(
            context,
            new AddBookshelfBookCommand()
            {
                Id = id.ToString(),
                Isbn = id.ToString(),
                BookshelfId = [id, idB],
            }
        );

        using var context2 = fixture.CreateContext();
        var bookshelfBooksA = context2
            .BookshelfBook.Where(x => x.BookshelfId == id && x.Isbn == id.ToString())
            .ToList();

        Assert.NotNull(bookshelfBooksA);
        Assert.Single(bookshelfBooksA);

        var bookshelfBooksB = context2
            .BookshelfBook.Where(x => x.BookshelfId == idB && x.Isbn == id.ToString())
            .ToList();

        Assert.NotNull(bookshelfBooksB);
        Assert.Single(bookshelfBooksB);
    }
}
