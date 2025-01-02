namespace Server.Domain.Commands;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;

public class AddBookshelfCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public required List<string> Bookshelves { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        var customer = await dbContext
            .Customer
            .Include(x => x.Bookshelves)
            .SingleOrDefaultAsync(x => x.Id == Id, cancellationToken);

        if (customer == null)
        {
            return; // Handle missing customer or book
        }

        foreach (var name in Bookshelves)
        {
            dbContext
                .Bookshelves
                .Add(
                    new Bookshelf()
                    {
                        Id = Guid.NewGuid(),
                        Name = name,
                        CustomerId = customer.Id
                    }
                );
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
