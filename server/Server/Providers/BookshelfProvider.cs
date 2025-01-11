using Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;
using Server.Models;

namespace Server.Providers;

public class BookshelfProvider(BookRepoContext context) : IBookshelfProvider
{
    public async Task<Models.CustomerBookshelf?> GetBookshelfById(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var customerBookshelf =
            from bookshelf in context.Bookshelves
            where bookshelf.Id == id
            select new Models.CustomerBookshelf
            {
                Id = bookshelf.Id,
                Name = bookshelf.Name,
                CreationDate = bookshelf.CreationDate,
                UpdatedDate = bookshelf.UpdatedDate,
                HomelessBooks = bookshelf.HomelessBooks,
                Books = (
                    from book in context.BookshelfBook
                    where book.BookshelfId == bookshelf.Id
                    select new BooktoShelf
                    {
                        Book = book.CustomerBook.Book,
                        Order = book.Order,
                        Ranking = book.CustomerBook.Ranking,
                        Id = book.CustomerBook.Id,
                    }
                ).ToList()
            };
        return await customerBookshelf.FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<BookshelfSummary>> GetBookshelfSummary(
        string customerId,
        CancellationToken cancellationToken
    ) =>
        await context
            .Bookshelves
            .Where(x => x.CustomerId == customerId)
            .Select(bookshelf => new BookshelfSummary { Id = bookshelf.Id, Name = bookshelf.Name })
            .ToListAsync(cancellationToken);

    public async Task<Guid> GetHomelessBookshelfId(
        string customerId,
        CancellationToken cancellationToken
    )
    {
        if (
            await context
                .Bookshelves
                .SingleOrDefaultAsync(
                    x => x.CustomerId == customerId && x.HomelessBooks,
                    cancellationToken
                ) is
            { } homeless
        )
        {
            return homeless.Id;
        }

        if (await context.Customer.FindAsync([ customerId ], cancellationToken) is not { } customer)
        {
            throw new UserNotFoundException();
        }

        var newHomeless = StaticBookshelf.Homeless();
        context.Bookshelves.Add(newHomeless with { CustomerId = customerId });
        return newHomeless.Id;
    }
}
