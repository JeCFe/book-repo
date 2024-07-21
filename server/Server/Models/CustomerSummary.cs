namespace Server.Models;

using Server.Domain.Models;

public record CustomerSummary
{
    public required string Id { get; init; }
    public required DateTimeOffset CreatedOn { get; init; }
    public required List<CustomerBookshelf> Bookshelves { get; init; }
    public required List<Trophy> Trophies { get; init; }
}

public record CustomerBookshelf()
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required List<BooktoShelf> Books { get; init; } = [ ];
    public required DateTimeOffset CreationDate { get; init; }
    public required DateTimeOffset UpdatedDate { get; set; }
    public required bool HomelessBooks { get; init; }
}

public record BooktoShelf()
{
    public required Guid Id { get; init; }
    public required Book Book { get; init; }
    public required int Order { get; init; }
    public int Ranking { get; init; }
}
