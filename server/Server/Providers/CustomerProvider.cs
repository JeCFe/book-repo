using Server.Context;
using Server.Domain;
using Server.Domain.Models;
using Server.Exceptions;
using Server.Helpers;
using Server.Models;

namespace Server.Providers;

public class CustomerProvider(IUserContext userContext, IClock clock, BookRepoContext dbContext)
    : ICustomerProvider
{
    public async Task<CustomerSummary> GetCustomerSummary(CancellationToken cancellationToken)
    {
        var userId = userContext.UserId ?? throw new InvalidUserException();
        var customer = await dbContext.Customer.FindAsync([ userId ], cancellationToken);

        if (customer is not { })
        {
            var newCustomer = await SetupNewCustomerAccount(userId, cancellationToken);
            return new()
            {
                CreatedOn = newCustomer.CreationDate,
                Bookshelves =  [ .. newCustomer.Bookshelves ]
            };
        }

        return new()
        {
            CreatedOn = customer.CreationDate,
            Bookshelves =  [ .. customer.Bookshelves ]
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
                    Books = [],
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Currently Reading",
                    Books = [],
                    CreationDate = clock.UtcNow,
                    UpdatedDate = clock.UtcNow,
                    
                },
                    new (){
                    Id = Guid.NewGuid(),
                    Name = "Read",
                    Books = [],
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
