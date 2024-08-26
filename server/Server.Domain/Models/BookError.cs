namespace Server.Domain.Models;

using Server.Domain.Scalars;

public record BookError
{
    public string? AdditionalCustomerComment { get; init; }

    public DateTimeOffset CreatedAt { get; } = DateTimeOffset.UtcNow;

    public Book Book { get; private set; }
    public string Isbn { get; private set; }
    public BookErrorType Error { get; private set; }
    public ICollection<AdminComment> AdminComment { get; private set; } = [ ];
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

    public bool AddAdminComment(AdminComment adminComment)
    {
        if (isPending())
        {
            return false;
        }
        AdminComment.Add(adminComment);
        UpdatedAt = DateTimeOffset.UtcNow;
        return true;
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
