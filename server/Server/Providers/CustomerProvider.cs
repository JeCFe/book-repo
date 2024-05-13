using Microsoft.EntityFrameworkCore;
using Server.Context;
using Server.Domain;
using Server.Domain.Models;
using Server.Exceptions;
using Server.Helpers;
using Server.Models;

namespace Server.Providers;

public class CustomerProvider(IClock clock, BookRepoContext dbContext) : ICustomerProvider
{
    public async Task<CustomerSummary> GetCustomerSummary(
        string userId,
        CancellationToken cancellationToken
    )
    {
        var customer = await dbContext
            .Customer
            .Include(x => x.Bookshelves)
            .SingleOrDefaultAsync(x => x.CustomerId == userId, cancellationToken);

        if (customer is not { })
        {
            var newCustomer = await SetupNewCustomerAccount(userId, cancellationToken);
            return new()
            {
                Id = newCustomer.CustomerId,
                CreatedOn = newCustomer.CreationDate,
                Bookshelves =
                [
                    ..newCustomer.Bookshelves.Select(x => new Models.Bookshelf() {
                        Name = x.Name,
                        Id = x.Id,
                        CreationDate = x.CreationDate,
                        UpdatedDate = x.UpdatedDate,
                        Books = []
                })
                ]
            };
        }

        return new()
        {
            Id = customer.CustomerId,
            CreatedOn = customer.CreationDate,
            Bookshelves =
            [
                ..customer.Bookshelves.Select(x => new Models.Bookshelf() {
                        Name = x.Name,
                        Id = x.Id,
                        CreationDate = x.CreationDate,
                        UpdatedDate = x.UpdatedDate,
                        Books = [..dbContext.BookshelfBook.Where(y => y.Bookshelf.Id == x.Id).Select(z => new BooktoShelf(){
                            Order = z.Order,
                            Book = z.Book
                        })]
                        })
            ]
        };
    }

    public async Task<Customer> SetupNewCustomerAccount(
        string customerId,
        CancellationToken cancellationToken
    )
    {
        Customer customer =
            new()
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                CreationDate = clock.UtcNow,
                Bookshelves =
                [
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
             
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Currently Reading",  
               
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Read",
             
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                ]
            };

        dbContext.Customer.Add(customer);

        await dbContext.SaveChangesAsync(cancellationToken);
        return customer;
    }
}
