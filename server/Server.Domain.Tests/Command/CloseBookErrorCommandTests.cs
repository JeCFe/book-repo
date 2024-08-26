namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Common.Scalars.Types;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Commands;
using Server.Domain.Commands.Admin;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class CloseBookErrorCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Will_successfully_close_book_error()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();
        var comment = "Unable to resolve soz";
        var book = new Models.Book() { Isbn = isbn, Name = "Test Book" };
        book.AddError(new(book, BookErrorType.Title));
        context.Books.Add(book);
        context.SaveChanges();

        await fixture.Execute(
            context,
            new CloseBookErrorCommand()
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
        Assert.Equal(BookErrorStatus.Closed, booksErrors[0].Status);
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
                    new CloseBookErrorCommand() { Isbn = isbn, Type = BookErrorType.Title }
                )
        );

        Assert.Equal($"Book for {isbn} can not be found.", message.Message);
    }

    [Fact]
    public async Task Will_throw_exception_if_book_already_marked_as_closed()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();
        BookErrorType type = BookErrorType.Title;
        var book = new Book() { Isbn = isbn, Name = "Test Book" };
        var error = new BookError(book, type) { };
        error.UpdateStatus(BookErrorStatus.Completed);
        book.AddError(error);
        context.Books.Add(book);
        context.SaveChanges();

        await Assert.ThrowsAsync<InvalidOperationException>(
            async () =>
                await fixture.Execute(
                    context,
                    new CloseBookErrorCommand() { Isbn = isbn, Type = type }
                )
        );
    }
}
