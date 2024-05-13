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
            .SingleOrDefaultAsync(x => x.CustomerId == userId, cancellationToken);

        if (customer is not { })
        {
            var newCustomer = await SetupNewCustomerAccount(userId, cancellationToken);
            return new()
            {
                Id = newCustomer.CustomerId,
                CreatedOn = newCustomer.CreationDate,
                Bookshelves =  [ .. newCustomer.Bookshelves ]
            };
        }

        return new()
        {
            Id = customer.CustomerId,
            CreatedOn = customer.CreationDate,
            Bookshelves =  [ .. customer.Bookshelves ]
        };
    }

    public async Task<Customer> SetupNewCustomerAccount(
        string customerId,
        CancellationToken cancellationToken
    )
    {
        var isbn = "123";
        Book book = new Book()
        {
            Isbn = isbn,
            Name = "Tester",
            Author = "Me",
            Release = "Now",
            Picture = "No"
        };

        var thisShelf = Guid.NewGuid();
        var id = Guid.NewGuid();
        Customer customer =
            new()
            {
                Id = id,
                CustomerId = customerId,
                CreationDate = clock.UtcNow,
                Bookshelves =
                [
                    new (){
                    Id = thisShelf,
                    Name = "Wanting to read",
                                  Books = [book],
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Currently Reading",  
                    Books = [book],
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Read",
                                  Books = [book],
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                ]
            };
        dbContext.Books.Add(book);

        dbContext.Customer.Add(customer);

        await dbContext.SaveChangesAsync(cancellationToken);
        return customer;
    }
}
