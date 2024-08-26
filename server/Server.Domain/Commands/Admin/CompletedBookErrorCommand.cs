namespace Server.Domain.Commands.Admin;

using Common.Exceptions;
using Common.MediatR;
using Common.Scalars.Types;
using Server.Domain;
using Server.Domain.Models;

public class CompletedBookErrorCommand : ICommand<BookRepoContext>
{
    public required string Isbn { get; init; }
    public required BookErrorType Type { get; init; }
    public string? Comment { get; init; }

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

        bookError.UpdateStatus(
            BookErrorStatus.Completed,
            new AdminComment() { Comment = Comment, AdminUsername = ctx.userName }
        );

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
