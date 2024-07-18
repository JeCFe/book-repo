namespace Server.Domain.Models;

public record Shareable
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required Customer Customer { get; init; }
    public List<ShareableBookshelf> Bookshelves { get; set; } = [ ];
    public ShareableBookShowcase? Showcase { get; set; } = null;
}

public record ShareableBookshelf
{
    public Guid? Id { get; init; }
    public required Bookshelf Bookshelf { get; init; }
    public required int Order { get; init; }
}

public record ShareableBookShowcase
{
    public Guid? Id { get; init; }
    public required CustomerBook CustomerBook { get; init; }
    public bool ShowRanking { get; init; } = true;
    public bool ShowComment { get; init; } = true;
}
