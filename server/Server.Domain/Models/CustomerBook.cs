namespace Server.Domain.Models;

public record CustomerBook
{
    public required Guid CustomerId { get; init; }
    public required string Isbn { get; init; }
    public required ICollection<Bookshelf> Bookshelves { get; set; }
    public int? Rating { get; init; }
}
