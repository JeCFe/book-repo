namespace Server.Domain.Models;

public record Bookshelf
{
    public required Guid Id { get; init; }
    public string? CustomerId { get; init; }
    public required string Name { get; init; }
    public DateTimeOffset CreationDate { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedDate { get; set; } = DateTimeOffset.UtcNow;
    public bool HomelessBooks { get; set; } = false;
}
