using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Models;

namespace Server.Providers;

public class BookshelfProvider(BookRepoContext context) : IBookshelfProvider
{
    public async Task<Bookshelf?> GetBookshelfById(Guid id, CancellationToken cancellationToken)
    {
        var customerBookshelf =
            from bookshelf in context.Bookshelves
            where bookshelf.Id == id
            select new Bookshelf
            {
                Id = bookshelf.Id,
                Name = bookshelf.Name,
                CreationDate = bookshelf.CreationDate,
                UpdatedDate = bookshelf.UpdatedDate,
                Books = (
                    from book in context.BookshelfBook
                    where book.BookshelfId == bookshelf.Id
                    select new BooktoShelf { Book = book.Book, Order = book.Order }
                ).ToList()
            };
        return await customerBookshelf.FirstOrDefaultAsync(cancellationToken);
    }
}
