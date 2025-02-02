namespace Server.Domain.Models;

public record Customer
{
    public required string Id { get; init; }
    public ICollection<Bookshelf> Bookshelves { get; set; } = [];
    public ICollection<Shareable>? Shareables { get; set; } = [];
    public ICollection<Trophy> Trophies { get; set; } = [];
    public DateTimeOffset CreationDate { get; init; } = DateTimeOffset.UtcNow;
}
