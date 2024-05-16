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
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            await dbContext.Customer.SingleOrDefaultAsync(x => x.Id == Id, cancellationToken) is { }
        )
        {
            return;
        }

        Customer customer = new() { Id = Id, CreationDate = ctx.time.GetUtcNow(), };

        if (IncludeDefaultBookshelves)
        {
            customer.Bookshelves =
            [
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
                    CreationDate = ctx.time.GetUtcNow(),
                    UpdatedDate = ctx.time.GetUtcNow(),
                    
                },
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Currently Reading",  
                    CreationDate = ctx.time.GetUtcNow(),
                    UpdatedDate = ctx.time.GetUtcNow(),
                    
                },
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Read",
             
                    CreationDate = ctx.time.GetUtcNow(),
                    UpdatedDate = ctx.time.GetUtcNow(),
                    
                },
            ];
        }

        dbContext.Customer.Add(customer);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
