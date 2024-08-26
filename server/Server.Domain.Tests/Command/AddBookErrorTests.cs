namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Commands;
using Server.Domain.Scalars;
using Server.Domain.Tests.Fixtures;

public class AddBookErrorTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Will_successfully_add_book_error()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();
        var comment = "There is an issue with the title";
        context.Books.Add(new Models.Book() { Isbn = isbn, Name = "Test Book" });
        context.SaveChanges();

        await fixture.Execute(
            context,
            new AddBookErrorCommand()
            {
                Isbn = isbn,
                Comment = comment,
                Type = BookErrorType.Title
            }
        );

        using var context2 = fixture.CreateContext();

        var booksErrors = context2
            .Books
            .Include(x => x.BookErrors)
            .Single(x => x.Isbn == isbn)
            .BookErrors;

        Assert.Single(booksErrors);
        Assert.Equal(comment, booksErrors[0].AdditionalCustomerComment);
        Assert.Equal(BookErrorType.Title, booksErrors[0].Error);
    }

    [Fact]
    public async Task Will_throw_exception_if_book_doesnt_exist()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();

        var message = await Assert.ThrowsAsync<BookNotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new AddBookErrorCommand() { Isbn = isbn, Type = BookErrorType.Title }
                )
        );

        Assert.Equal($"Book for {isbn} can not be found.", message.Message);
    }

    [Fact]
    public async Task Will_throw_exception_if_book_already_contains_that_error()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();
        BookErrorType type = BookErrorType.Title;
        var book = new Models.Book() { Isbn = isbn, Name = "Test Book" };
        book.AddError(new(book, type) { });
        context.Books.Add(book);
        context.SaveChanges();

        var message = await Assert.ThrowsAsync<BookContainsErrorException>(
            async () =>
                await fixture.Execute(
                    context,
                    new AddBookErrorCommand() { Isbn = isbn, Type = type }
                )
        );

        Assert.Equal($"Book for {isbn} already contains error for type {type}", message.Message);
    }
}
