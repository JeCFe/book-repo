namespace Server.Domain.Commands;

using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;

public class UpdateBookcaseOrderCommand : ICommand<BookRepoContext>
{
    public required string CustomerId { get; init; }
    public required Guid BookshelfId { get; init; }
    public required List<UpdateBook> Books { get; init; }

    public async Task Execute(
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
            return;
        }

        foreach (var book in Books)
        {
            await dbContext
                .BookshelfBook.Where(x => x.BookshelfId == BookshelfId && x.Isbn == book.Isbn)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(y => y.Order, book.Order),
                    cancellationToken
                );
        }
    }
}
