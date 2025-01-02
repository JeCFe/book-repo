namespace Server.Domain.Tests.Commands;

using Common.Exceptions;
using Common.Scalars.Types;
using Server.Domain.Commands.Admin;
using Server.Domain.Tests.Fixtures;

public class UpdateBookErrorTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Fact]
    public async Task Will_successfully_update_book_error()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();
        BookErrorType type = BookErrorType.Title;
        var book = new Models.Book() { Isbn = isbn, Name = "Test Book" };
        book.AddError(new(book, type) { });

        context.Books.Add(book);
        context.SaveChanges();

        var comment = "Progressing this error";

        await fixture.Execute(
            context,
            new UpdateBookErrorCommand()
            {
                Isbn = isbn,
                Comment = comment,
                Type = BookErrorType.Title
            },
            "Test Jess"
        );

        Assert.Single(book.BookErrors);
        Assert.NotEqual(book.BookErrors[0].CreatedAt, book.BookErrors[0].UpdatedAt);
        Assert.Single(book.BookErrors[0].AdminComment);
        Assert.Equal("Test Jess", book.BookErrors[0].AdminComment[0].AdminUsername);
        Assert.Equal(comment, book.BookErrors[0].AdminComment[0].Comment);
    }

    [Fact]
    public async Task Will_throw_exception_if_book_error_doesnt_exist()
    {
        using var context = fixture.CreateContext();
        var isbn = Guid.NewGuid().ToString();

        var message = await Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await fixture.Execute(
                    context,
                    new UpdateBookErrorCommand()
                    {
                        Isbn = isbn,
                        Type = BookErrorType.Title,
                        Comment = "Test"
                    }
                )
        );

        Assert.Equal($"Error type {BookErrorType.Title} for {isbn} not found", message.Message);
    }
}
