namespace Server.Domain.Commands;

using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Exceptions;
using Server.Domain.Models;
using Server.Domain.Scalars;

public class UpdateBookError : ICommand<BookRepoContext>
{
    public required string Isbn { get; init; }
    public required BookErrorType Type { get; init; }
    public required string Comment { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            await dbContext.BookErrors.FindAsync([ Isbn, Type ], cancellationToken)
            is not { } bookError
        )
        {
            throw new NotFoundException($"Error type {Type} for {Isbn} not found");
        }

        bookError.AddAdminComment(
            new AdminComment() { Comment = Comment, AdminUsername = ctx.userName }
        );

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
