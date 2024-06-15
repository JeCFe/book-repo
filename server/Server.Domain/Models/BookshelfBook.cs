namespace Server.Domain.Models;

public class BookshelfBook()
{
    public required Guid BookshelfId { get; init; }
    public required Guid CustomerBookId { get; init; }
    public required int Order { get; set; }
    public required string Isbn { get; init; }

    public required Bookshelf Bookshelf { get; init; }
    public required CustomerBook CustomerBook { get; init; }
}
