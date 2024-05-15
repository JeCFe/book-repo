namespace Server.Domain.Commands;

using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;

public class SetupCustomerCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public bool IncludeDefaultBookshelves { get; init; }

    public async Task Execute(
        BookRepoContext context,
        CommandContext publisher,
        CancellationToken cancellationToken
    )
    {
        var dateTimeNow = DateTimeOffset.UtcNow;
        Customer customer = new() { Id = Id, CreationDate = dateTimeNow, };

        if (IncludeDefaultBookshelves)
        {
            customer.Bookshelves =
            [
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
                    CreationDate = dateTimeNow,
                    UpdatedDate = dateTimeNow,
                    
                },
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Currently Reading",  
                    CreationDate = dateTimeNow,
                    UpdatedDate = dateTimeNow,
                    
                },
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Read",
             
                    CreationDate = dateTimeNow,
                    UpdatedDate = dateTimeNow,
                    
                },
            ];
        }

        context.Customer.Add(customer);

        await context.SaveChangesAsync(cancellationToken);
    }
}
