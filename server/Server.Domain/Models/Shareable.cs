namespace Server.Domain.Models;

public record Shareable
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required Customer Customer { get; init; }
    public List<ShareableBookshelf>? Bookshelves { get; init; } = [ ];
    public ShareableBookShowcase? Showcase { get; init; } = null;
}

public record ShareableBookshelf
{
    public required Bookshelf Bookshelves { get; init; }
    public required int Order { get; init; }
}

public record ShareableBookShowcase
{
    public required CustomerBook CustomerBook { get; init; }
    public bool ShowRanking { get; init; } = true;
    public bool ShowComment { get; init; } = true;
}
