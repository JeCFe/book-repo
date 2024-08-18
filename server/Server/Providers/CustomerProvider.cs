namespace Server.Providers;

using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Server.Domain;
using Server.Domain.Models;
using Server.Domain.Scalars;
using Server.Exceptions;
using Server.Models;

public class CustomerProvider(BookRepoContext dbContext, IOptions<BetaTestOptions> betaOptions)
    : ICustomerProvider
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
                .Include(x => x.Trophies)
                .SingleOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new UserNotFoundException();

        if (betaOptions.Value.Enabled && !customer.Trophies.OfType<BetaTester>().Any())
        {
            customer.Trophies.Add(new BetaTester(true) { DateJoined = customer.CreationDate });
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return new()
        {
            Id = customer.Id,
            CreatedOn = customer.CreationDate,
            Bookshelves =
            [
                ..customer.Bookshelves.Select(x => new Models.CustomerBookshelf() {
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
            ],
            Trophies = customer
                .Trophies
                .Select(
                    x =>
                        new TrophyData()
                        {
                            Trophy = x,
                            Type = x switch
                            {
                                BetaTester => TrophyType.BetaTester,
                                Alerter => TrophyType.Alerter,
                                Contributor => TrophyType.Contributor,
                                BookAddict => TrophyType.BookAddict,
                                Sponsor => TrophyType.Sponsor,
                                SharingIsCaring => TrophyType.SharingIsCaring,
                                AvidReviewer => TrophyType.AvidReviewer,
                                Commentator => TrophyType.Commentator,
                                GoalScored => TrophyType.GoalScored,
                                GoalSetter => TrophyType.GoalSetter,
                                _ => throw new NotImplementedException()
                            }
                        }
                )
                .ToList()
        };
    }

    public async Task<Models.ResponseCustomerBook?> GetCustomerBook(
        Guid customerBookId,
        string customerId,
        CancellationToken cancellationToken
    )
    {
        var customerBook = await dbContext
            .CustomerBooks
            .Include(cb => cb.Book)
            .Select(
                x =>
                    new Models.ResponseCustomerBook()
                    {
                        Comment = x.Comment,
                        Book = x.Book,
                        Id = x.Id,
                        Ranking = x.Ranking
                    }
            )
            .SingleOrDefaultAsync(cb => cb.Id == customerBookId, cancellationToken);

        if (customerBook == null)
        {
            return null;
        }

        customerBook.BookshelfSummaries = await dbContext
            .BookshelfBook
            .Where(x => x.CustomerBookId == customerBook.Id)
            .Select(
                y =>
                    new BookshelfSummary
                    {
                        Id = y.BookshelfId,
                        Name = y.Bookshelf.Name,
                        ContainsBook = true
                    }
            )
            .ToListAsync(cancellationToken);

        foreach (var bookshelf in dbContext.Bookshelves.Where(x => x.CustomerId == customerId))
        {
            if (customerBook.BookshelfSummaries.Any(x => x.Id == bookshelf.Id))
            {
                continue;
            }
            customerBook
                .BookshelfSummaries
                .Add(new BookshelfSummary { Id = bookshelf.Id, Name = bookshelf.Name, });
        }

        return customerBook;
    }

    public async Task<List<Models.ResponseCustomerBook>> GetCustomerBooks(
        string customerId,
        CancellationToken cancellationToken
    ) =>
        await dbContext
            .CustomerBooks
            .Where(x => x.CustomerId == customerId)
            .Select(
                x =>
                    new Models.ResponseCustomerBook()
                    {
                        Comment = x.Comment,
                        Book = x.Book,
                        Id = x.Id,
                        Ranking = x.Ranking
                    }
            )
            .ToListAsync(cancellationToken);
}
