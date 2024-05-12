namespace Server.Domain.Models;

public record Bookshelf
{
    public required Guid Id { get; init; }
    public required Guid CustomerId { get; init; }
    public required Customer Customer { get; init; }
    public required string Name { get; init; }
    public required ICollection<Book> Books { get; set; }
    public required DateTimeOffset CreationDate { get; init; }
    public required DateTimeOffset UpdatedDate { get; set; }
}
