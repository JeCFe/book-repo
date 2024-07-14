using Server.Domain.Models;

namespace Server.Models;

public record CustomerBook
{
    public required Guid Id { get; init; }
    public int? Ranking { get; init; } = 0;
    public string? Comment { get; init; }
    public required Book Book { get; init; }
    public List<BookshelfSummary>? BookshelfSummaries { get; set; }
}
