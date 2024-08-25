namespace Server.Domain.Models;

using Server.Domain.Scalars;

public record BookError
{
    public required Book Book { get; init; }
    public required string Isbn { get; init; }
    public required BookErrorType Error { get; init; }
    public string? AdditionalCustomerComment { get; init; }
    public ICollection<AdminComment> AdminComment { get; set; } = [ ];

    public DateTimeOffset CreatedAt { get; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }

    public BookErrorStatus Status { get; set; } = BookErrorStatus.Pending;

    public BookError(Book book)
    {
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
    public required string Comment { get; init; }
    public required string AdminUsername { get; init; }
}
