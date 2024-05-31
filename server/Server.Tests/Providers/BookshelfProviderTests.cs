using Moq;
using Server.Domain.Models;
using Server.Exceptions;
using Server.Providers;
using Server.Tests.Fixtures;

namespace Server.Tests;

public class BookshelfProviderTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Will_return_null_if_theres_no_matching_bookshelf()
    {
        var context = fixture.CreateContext();

        var bookshelfId = Guid.NewGuid();

        var provider = new BookshelfProvider(context);
        var bookshelf = await provider.GetBookshelfById(bookshelfId, CancellationToken.None);

        Assert.Null(bookshelf);
    }

    [Fact]
    public async Task Will_return_bookshelf_with_no_books()
    {
        var context = fixture.CreateContext();

        var bookshelfId = Guid.NewGuid();
        var customerId = Guid.NewGuid().ToString();

        var customer = new Customer() { Id = customerId, CreationDate = DateTimeOffset.UtcNow };

        var domainBookshelf = new Bookshelf()
        {
            Id = bookshelfId,
            CustomerId = customerId,
            Name = "TestBookshelf",
            CreationDate = DateTimeOffset.Now,
        };
        context.Customer.Add(customer);
        context.Bookshelves.Add(domainBookshelf);
        context.SaveChanges();

        var provider = new BookshelfProvider(context);
        var bookshelf = await provider.GetBookshelfById(bookshelfId, CancellationToken.None);

        Assert.NotNull(bookshelf);
        Assert.Empty(bookshelf.Books);
        Assert.Equal(domainBookshelf.Name, bookshelf.Name);
    }

    [Fact]
    public async Task Will_return_bookshelf_with_books()
    {
        var context = fixture.CreateContext();

        var bookshelfId = Guid.NewGuid();
        var customerId = Guid.NewGuid().ToString();

        var customer = new Customer() { Id = customerId, CreationDate = DateTimeOffset.UtcNow };

        var domainBook = new Book() { Isbn = "1234", Name = "Test" };

        var domainBookshelf = new Bookshelf()
        {
            Id = bookshelfId,
            CustomerId = customerId,
            Name = "TestBookshelf",
            CreationDate = DateTimeOffset.Now,
        };

        var customerBook = new BookshelfBook()
        {
            Book = domainBook,
            Isbn = domainBook.Isbn,
            Bookshelf = domainBookshelf,
            BookshelfId = domainBookshelf.Id,
            Order = 0
        };
        context.Customer.Add(customer);
        context.Bookshelves.Add(domainBookshelf);
        context.Books.Add(domainBook);
        context.BookshelfBook.Add(customerBook);
        context.SaveChanges();

        var provider = new BookshelfProvider(context);
        var bookshelf = await provider.GetBookshelfById(bookshelfId, CancellationToken.None);

        Assert.NotNull(bookshelf);
        Assert.Single(bookshelf.Books);
        Assert.Equal(customerBook.Isbn, bookshelf.Books.First().Book.Isbn);
        Assert.Equal(domainBookshelf.Name, bookshelf.Name);
    }
}
