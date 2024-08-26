namespace Server.Domain.Commands;

using Common.Exceptions;
using Common.MediatR;
using Common.Scalars.Types;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;

public class AddBookErrorCommand : ICommand<BookRepoContext>
{
    public required string Isbn { get; init; }
    public string? Comment { get; init; }
    public required BookErrorType Type { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            await dbContext
                .Books
                .Include(x => x.BookErrors)
                .SingleOrDefaultAsync(x => x.Isbn == Isbn, cancellationToken)
            is not { } book
        )
        {
            throw new BookNotFoundException(Isbn);
        }

        if (book.BookErrors.Any(x => x.Error == Type))
        {
            throw new BookContainsErrorException(Isbn, Type);
        }

        book.AddError(new BookError(book, Type) { AdditionalCustomerComment = Comment });
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
