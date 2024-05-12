namespace Server.Domain.Models;

public record Customer
{
    public required Guid Id { get; init; }
    public required string CustomerId { get; init; }
    public required ICollection<Bookshelf> Bookshelves { get; set; }
    public required DateTimeOffset CreationDate { get; init; }
}
