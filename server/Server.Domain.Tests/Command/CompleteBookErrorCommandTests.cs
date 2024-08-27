namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Common.Scalars.Types;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Commands;
using Server.Domain.Commands.Admin;
using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class CompleteBookErrorCommandTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Will_successfully_complete_book_error()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();
        var comment = "Unable to resolve soz";
        var book = new Book() { Isbn = isbn, Name = "Test Book" };
        book.AddError(new(book, BookErrorType.Title));
        context.Books.Add(book);
        context.SaveChanges();

        await fixture.Execute(
            context,
            new CompletedBookErrorCommand()
            {
                Isbn = isbn,
                Comment = comment,
                Type = BookErrorType.Title
            }
        );

        using var context2 = fixture.CreateContext();

        Assert.Single(book.BookErrors);
        Assert.Equal(comment, book.BookErrors[0].AdminComment[0].Comment);
        Assert.Equal(BookErrorStatus.Completed, book.BookErrors[0].Status);
    }

    [Fact]
    public async Task Will_throw_exception_if_book_doesnt_exist()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();

        var message = await Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new CompletedBookErrorCommand() { Isbn = isbn, Type = BookErrorType.Title }
                )
        );

        Assert.Equal($"Error type {BookErrorType.Title} for {isbn} not found", message.Message);
    }

    [Fact]
    public async Task Will_throw_exception_if_book_already_marked_as_closed()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();
        BookErrorType type = BookErrorType.Title;
        var book = new Book() { Isbn = isbn, Name = "Test Book" };
        var error = new BookError(book, type) { };
        error.UpdateStatus(BookErrorStatus.Closed);
        book.AddError(error);
        context.Books.Add(book);
        context.SaveChanges();

        await Assert.ThrowsAsync<InvalidOperationException>(
            async () =>
                await fixture.Execute(
                    context,
                    new CompletedBookErrorCommand() { Isbn = isbn, Type = type }
                )
        );
    }
}
