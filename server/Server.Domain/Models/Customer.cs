namespace Server.Domain.Models;

public record Customer
{
    public required string Id { get; init; }
    public ICollection<Bookshelf> Bookshelves { get; set; } = [ ];
    public ICollection<Shareable>? Shareables { get; set; } = [ ];
    public required DateTimeOffset CreationDate { get; init; }
}
