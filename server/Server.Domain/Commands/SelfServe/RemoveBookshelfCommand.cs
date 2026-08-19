namespace Server.Domain.Commands;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class RemoveBookshelfCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public required Guid BookshelfId { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            !await dbContext.Bookshelves.AnyAsync(
                x => x.Id == BookshelfId && x.CustomerId == Id,
                cancellationToken
            )
        )
        {
            return;
        }

        await dbContext
            .BookshelfBook.Where(x => x.BookshelfId == BookshelfId)
            .ExecuteDeleteAsync(cancellationToken);
        await dbContext
            .Bookshelves.Where(x => x.CustomerId == Id && x.Id == BookshelfId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
