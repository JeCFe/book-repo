namespace Server.Domain.Tests;

using Server.Domain.Models;

public class BookModelTests
{
    [Fact]
    public void AddError_adds_error_when_it_does_not_already_exist()
    {
        var book = new Book { Isbn = "1234567890", Name = "Test Book" };
        var error = new BookError(book, Common.Scalars.Types.BookErrorType.Title);

        var result = book.AddError(error);

        Assert.True(result);
        Assert.Single(book.BookErrors);
    }

    [Fact]
    public void AddError_returns_false_and_does_not_add_when_error_type_already_exists()
    {
        var book = new Book { Isbn = "1234567890", Name = "Test Book" };
        var error = new BookError(book, Common.Scalars.Types.BookErrorType.Title);
        book.BookErrors.Add(error);

        var result = book.AddError(new BookError(book, Common.Scalars.Types.BookErrorType.Title));

        Assert.False(result);
        Assert.Single(book.BookErrors);
    }

    [Fact]
    public void AddError_can_add_errors_of_different_types()
    {
        var book = new Book { Isbn = "1234567890", Name = "Test Book" };
        book.BookErrors.Add(new BookError(book, Common.Scalars.Types.BookErrorType.Title));

        var result = book.AddError(new BookError(book, Common.Scalars.Types.BookErrorType.Author));

        Assert.True(result);
        Assert.Equal(2, book.BookErrors.Count);
    }
}
