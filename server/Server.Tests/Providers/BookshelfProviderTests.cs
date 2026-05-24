using Common.Exceptions;
using Server.Domain.Models;
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
        context.Customers.Add(customer);
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
        var customerBook = new CustomerBook()
        {
            Id = Guid.NewGuid(),
            Book = domainBook,
            Isbn = domainBook.Isbn,
            CustomerId = customer.Id,
            Customer = customer,
        };

        var bookshelfBook = new BookshelfBook()
        {
            CustomerBook = customerBook,
            CustomerBookId = customerBook.Id,
            Isbn = domainBook.Isbn,
            Bookshelf = domainBookshelf,
            BookshelfId = domainBookshelf.Id,
            Order = 0,
        };
        context.Customers.Add(customer);
        context.Bookshelves.Add(domainBookshelf);
        context.Books.Add(domainBook);
        context.CustomerBooks.Add(customerBook);
        context.BookshelfBook.Add(bookshelfBook);
        context.SaveChanges();

        var provider = new BookshelfProvider(context);
        var bookshelf = await provider.GetBookshelfById(bookshelfId, CancellationToken.None);

        Assert.NotNull(bookshelf);
        Assert.Single(bookshelf.Books);
        Assert.Equal(bookshelfBook.Isbn, bookshelf.Books.First().Book.Isbn);
        Assert.Equal(domainBookshelf.Name, bookshelf.Name);
    }

    [Fact]
    public async Task GetBookshelfSummary_returns_empty_list_when_customer_has_no_bookshelves()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        context.SaveChanges();

        var provider = new BookshelfProvider(context);
        var result = await provider.GetBookshelfSummary(customerId, CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetBookshelfSummary_returns_name_and_id_for_each_bookshelf()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        var idA = Guid.NewGuid();
        var idB = Guid.NewGuid();
        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        context.Bookshelves.AddRange(
            new()
            {
                Id = idA,
                CustomerId = customerId,
                Name = "Reading",
                CreationDate = DateTimeOffset.UtcNow,
            },
            new()
            {
                Id = idB,
                CustomerId = customerId,
                Name = "Finished",
                CreationDate = DateTimeOffset.UtcNow,
            }
        );
        context.SaveChanges();

        var provider = new BookshelfProvider(context);
        var result = await provider.GetBookshelfSummary(customerId, CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Contains(result, x => x.Id == idA && x.Name == "Reading");
        Assert.Contains(result, x => x.Id == idB && x.Name == "Finished");
    }

    [Fact]
    public async Task GetHomelessBookshelfId_returns_existing_homeless_bookshelf_id()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        var homelessId = Guid.NewGuid();

        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        context.Bookshelves.Add(
            new()
            {
                Id = homelessId,
                CustomerId = customerId,
                Name = "Homeless Books",
                HomelessBooks = true,
                CreationDate = DateTimeOffset.UtcNow,
            }
        );
        context.SaveChanges();

        var provider = new BookshelfProvider(context);
        var result = await provider.GetHomelessBookshelfId(customerId, CancellationToken.None);

        Assert.Equal(homelessId, result);
    }

    [Fact]
    public async Task GetHomelessBookshelfId_throws_when_customer_does_not_exist()
    {
        var context = fixture.CreateContext();

        var provider = new BookshelfProvider(context);

        await Assert.ThrowsAsync<Common.Exceptions.UserNotFoundException>(
            async () =>
                await provider.GetHomelessBookshelfId(
                    Guid.NewGuid().ToString(),
                    CancellationToken.None
                )
        );
    }

    [Fact]
    public async Task GetHomelessBookshelfId_creates_and_persists_homeless_bookshelf_when_none_exists()
    {
        var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        context.SaveChanges();

        var provider = new BookshelfProvider(context);
        var returnedId = await provider.GetHomelessBookshelfId(customerId, CancellationToken.None);

        using var context2 = fixture.CreateContext();
        var persisted = context2.Bookshelves.SingleOrDefault(x =>
            x.CustomerId == customerId && x.HomelessBooks
        );
        Assert.NotNull(persisted);
        Assert.Equal(returnedId, persisted.Id);
    }
}
