namespace Server.Domain.Models;

public record Bookshelf
{
    public required Guid Id { get; init; }
    public string? CustomerId { get; init; }
    public required string Name { get; init; }
    public required DateTimeOffset CreationDate { get; init; }
    public DateTimeOffset UpdatedDate { get; set; } = DateTimeOffset.UtcNow;
}
