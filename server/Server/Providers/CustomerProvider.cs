namespace Server.Providers;

using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;
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
                ..customer.Bookshelves.Select(x => new Models.Bookshelf() {
                        Name = x.Name,
                        Id = x.Id,
                        CreationDate = x.CreationDate,
                        UpdatedDate = x.UpdatedDate,
                        HomelessBooks = x.HomelessBooks,
                        Books = [..dbContext.BookshelfBook.Where(y => y.Bookshelf.Id == x.Id).Select(z => new BooktoShelf(){
                            Order = z.Order,
                            Book = z.CustomerBook.Book,
                            Ranking = z.CustomerBook.Ranking,
                            Id = z.CustomerBook.Id,
                    })]
                })
            ]
        };
    }

    public async Task<Models.CustomerBook?> GetCustomerBook(
        Guid customerBookId,
        CancellationToken cancellationToken
    )
    {
        if (
            await dbContext
                .CustomerBooks
                .Include(x => x.Book)
                .SingleOrDefaultAsync(x => x.Id == customerBookId, cancellationToken)
            is not { } book
        )
        {
            return null;
        }

        return new Models.CustomerBook()
        {
            Id = book.Id,
            Book = book.Book,
            Ranking = book.Ranking,
            Comment = book.Comment
        };
    }

    public async Task<List<Models.CustomerBook>> GetCustomerBooks(
        string customerId,
        CancellationToken cancellationToken
    ) =>
        await dbContext
            .CustomerBooks
            .Where(x => x.CustomerId == customerId)
            .Select(
                x =>
                    new Models.CustomerBook()
                    {
                        Comment = x.Comment,
                        Book = x.Book,
                        Id = x.Id
                    }
            )
            .ToListAsync(cancellationToken);
}
