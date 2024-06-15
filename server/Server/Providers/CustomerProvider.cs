namespace Server.Providers;

using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Exceptions;
using Server.Models;

public class CustomerProvider(BookRepoContext dbContext) : ICustomerProvider
{
    public async Task<CustomerSummary> GetCustomerSummary(
        string userId,
        CancellationToken cancellationToken
    )
    {
        var customer =
            await dbContext
                .Customer
                .Include(x => x.Bookshelves)
                .SingleOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new UserNotFoundException();

        return new()
        {
            Id = customer.Id,
            CreatedOn = customer.CreationDate,
            Bookshelves =
            [
                ..customer.Bookshelves.Select(x => new Bookshelf() {
                        Name = x.Name,
                        Id = x.Id,
                        CreationDate = x.CreationDate,
                        UpdatedDate = x.UpdatedDate,
                        HomelessBooks = x.HomelessBooks,
                        Books = [..dbContext.BookshelfBook.Where(y => y.Bookshelf.Id == x.Id).Select(z => new BooktoShelf(){
                            Order = z.Order,
                            Book = z.CustomerBook.Book,
                            Ranking = z.CustomerBook.Ranking
                    })]
                })
            ]
        };
    }
}
