namespace Server.Domain.Models;

public record Bookshelf
{
    public required Guid Id { get; init; }
    public Guid? CustomerId { get; init; }
    public required string Name { get; init; }
    public required DateTimeOffset CreationDate { get; init; }
    public required DateTimeOffset UpdatedDate { get; set; }
}
