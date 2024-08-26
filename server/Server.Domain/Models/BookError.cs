namespace Server.Domain.Models;

using Common.Scalars.Types;

public record BookError
{
    public string? AdditionalCustomerComment { get; init; }

    public DateTimeOffset CreatedAt { get; } = DateTimeOffset.UtcNow;

    public Book Book { get; private set; }
    public string Isbn { get; private set; }
    public BookErrorType Error { get; private set; }
    public List<AdminComment> AdminComment { get; private set; } = [ ];
    public BookErrorStatus Status { get; private set; } = BookErrorStatus.Pending;
    public DateTimeOffset? UpdatedAt { get; private set; } = DateTimeOffset.UtcNow;

    private BookError()
    {
        Error = null!;
        Book = null!;
        Isbn = null!;
    }

    public BookError(Book book, BookErrorType error)
    {
        Error = error;
        Book = book;
        Isbn = book.Isbn;
    }

    private bool isPending() => Status != BookErrorStatus.Pending;

    public void AddAdminComment(AdminComment adminComment)
    {
        AdminComment.Add(adminComment);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public bool UpdateStatus(BookErrorStatus status, AdminComment adminComment)
    {
        if (isPending())
        {
            return false;
        }
        if (adminComment is { } comment)
        {
            AdminComment.Add(comment);
        }
        Status = status;
        UpdatedAt = DateTimeOffset.UtcNow;

        return true;
    }
}

public record AdminComment
{
    public DateTimeOffset Created { get; set; } = DateTimeOffset.UtcNow;
    public required string Comment { get; init; }
    public required string AdminUsername { get; init; }
}
