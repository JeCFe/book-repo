using Server.Domain.Models;

namespace Server.Models;

public record CustomerSummary
{
    public required string Id { get; init; }
    public required DateTimeOffset CreatedOn { get; init; }
    public required List<Bookshelf> Bookshelves { get; init; }
}
