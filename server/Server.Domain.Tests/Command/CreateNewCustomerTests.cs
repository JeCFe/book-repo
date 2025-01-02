namespace Server.Domain.Tests.Commands;

using Server.Domain.Commands;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class CreateNewCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async void Will_set_up_new_customer_with_default_bookshelves()
    {
        var id = Guid.NewGuid().ToString();

        using var context = fixture.CreateContext();

        await fixture.Execute(
            context,
            new SetupCustomerCommand() { Id = id, IncludeDefaultBookshelves = true }
        );

        using var context2 = fixture.CreateContext();

        Assert.NotNull(context2.Customer.Find([ id ]));
        Assert.Equal(3, context2.Bookshelves.Where(x => x.CustomerId == id).ToList().Count);
    }

    [Fact]
    public async void Will_set_up_new_customer_without_bookshelves()
    {
        var id = Guid.NewGuid().ToString();

        using var context = fixture.CreateContext();

        await fixture.Execute(context, new SetupCustomerCommand() { Id = id });

        using var context2 = fixture.CreateContext();

        Assert.NotNull(context2.Customer.Find([ id ]));
        Assert.Empty(context2.Bookshelves.Where(x => x.CustomerId == id));
    }

    [Fact]
    public async void Will_place_add_books_into_homeless_bookself()
    {
        var id = Guid.NewGuid().ToString();

        using var context = fixture.CreateContext();

        Book bookOne =
            new()
            {
                Isbn = Guid.NewGuid().ToString(),
                Name = "Jess' Adventure",
                Authors =  [ "Jess" ],
                Release = "Today",
                Picture = "None"
            };

        Book bookTwo =
            new()
            {
                Isbn = Guid.NewGuid().ToString(),
                Name = "Jess' Adventure",
                Authors =  [ "Jess" ],
                Release = "Today",
                Picture = "None"
            };
        context.Books.AddRange([ bookOne, bookTwo ]);
        context.SaveChanges();

        using var contextAct = fixture.CreateContext();

        await fixture.Execute(
            contextAct,
            new SetupCustomerCommand() { Id = id, Isbns =  [ bookOne.Isbn, bookTwo.Isbn ] }
        );

        using var contextAssert = fixture.CreateContext();

        var homelessBookShelf = contextAssert
            .Bookshelves
            .SingleOrDefault(x => x.CustomerId == id && x.Name == "Homeless Books");

        Assert.NotNull(homelessBookShelf);

        var bookshelfBooks = contextAssert
            .BookshelfBook
            .Where(x => x.BookshelfId == homelessBookShelf.Id)
            .ToList();

        Assert.NotNull(bookshelfBooks);
        Assert.Equal(2, bookshelfBooks.Count());
        Assert.NotNull(bookshelfBooks.SingleOrDefault(x => x.Isbn == bookOne.Isbn));
        Assert.NotNull(bookshelfBooks.SingleOrDefault(x => x.Isbn == bookTwo.Isbn));
    }
}
