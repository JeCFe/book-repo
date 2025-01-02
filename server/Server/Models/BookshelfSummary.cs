namespace Server.Models;

public record BookshelfSummary
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public bool? ContainsBook { get; set; } = false;
}
