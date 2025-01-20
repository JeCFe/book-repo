namespace Server.Domain.Commands;

using Common.Exceptions;
using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Events;
using Server.Domain.Models;

public class AddCustomerBookCommentCommand : ICommand<BookRepoContext>
{
    public required Guid CustomerBookId { get; init; }
    public required string CustomerId { get; init; }
    public required string Comment { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (await dbContext.Customer.FindAsync([CustomerId], cancellationToken) is not { })
        {
            throw new UserNotFoundException();
        }

        if (
            await dbContext.CustomerBooks.FindAsync([CustomerBookId], cancellationToken)
            is not { } customerBook
        )
        {
            throw new CustomerBookNotFoundException();
        }

        await ctx.Publish(
            new GiveCustomerTrophyEvent(
                CustomerId,
                new Commentator(
                    await dbContext
                        .CustomerBooks.Where(cb =>
                            cb.CustomerId == CustomerId && cb.Comment != null
                        )
                        .CountAsync(cancellationToken)
                )
                { }
            ),
            cancellationToken
        );

        customerBook.Comment = Comment;
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
