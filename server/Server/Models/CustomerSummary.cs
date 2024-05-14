using Server.Domain.Models;

namespace Server.Models;

public record CustomerSummary
{
    public required string Id { get; init; }
    public required DateTimeOffset CreatedOn { get; init; }
    public required List<Models.Bookshelf> Bookshelves { get; init; }
}

public record Bookshelf()
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required List<BooktoShelf> Books { get; init; } = [ ];
    public required DateTimeOffset CreationDate { get; init; }
    public required DateTimeOffset UpdatedDate { get; set; }
}

public record BooktoShelf()
{
    public required Book Book { get; init; }
    public required int Order { get; init; }
}
