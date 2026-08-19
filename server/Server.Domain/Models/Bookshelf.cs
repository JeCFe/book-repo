namespace Server.Domain.Models;

public record Bookshelf
{
    public required Guid Id { get; init; }
    public string? CustomerId { get; init; }
    public required string Name { get; init; }
    public DateTimeOffset CreationDate { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedDate { get; set; } = DateTimeOffset.UtcNow;

    // This should be changed to a scaler as a bookshelf can be
    // Normal, Currently Reading, Wanting to Read, Read, Homeless
    public bool HomelessBooks { get; set; } = false;
}
