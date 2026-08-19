namespace Server.Domain.Commands;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class RemoveBookshelfBookCommand : ICommand<BookRepoContext, int>
{
    public required string CustomerId { get; init; }
    public required string Isbn { get; init; }
    public required Guid BookshelfId { get; init; }

    public async Task<int> Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            !await dbContext.Bookshelves.AnyAsync(
                x => x.Id == BookshelfId && x.CustomerId == CustomerId,
                cancellationToken
            )
        )
        {
            return 0;
        }

        return await dbContext
            .BookshelfBook.Where(x =>
                x.BookshelfId == BookshelfId && x.Isbn == Isbn
            )
            .ExecuteDeleteAsync(cancellationToken);
    }
}
