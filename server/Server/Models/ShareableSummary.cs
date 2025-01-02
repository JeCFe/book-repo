using Server.Models;

public record ShareableSummary
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required DateTimeOffset Created { get; init; }
}
