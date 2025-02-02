namespace Server.Domain.Commands;

using Common.Exceptions;
using Common.MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;

public class AddCustomerBookToBookshelfCommand : ICommand<BookRepoContext>
{
    public required Guid CustomerBookId { get; init; }
    public required string CustomerId { get; init; }

    public required Guid BookshelfId { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            await dbContext.BookshelfBook.SingleOrDefaultAsync(
                x => x.CustomerBookId == CustomerBookId && x.BookshelfId == BookshelfId,
                cancellationToken
            ) is
            { }
        )
        {
            return;
        }

        var customerBook = await dbContext
            .CustomerBooks.Include(x => x.Book)
            .SingleOrDefaultAsync(x => x.Id == CustomerBookId, cancellationToken);

        var bookshelf = await dbContext.Bookshelves.FindAsync([BookshelfId], cancellationToken);

        if (customerBook == null)
        {
            throw new CustomerBookNotFoundException();
        }

        if (bookshelf == null)
        {
            throw new BookshelfNotFound();
        }

        var bookshelfBook = await dbContext.BookshelfBook.SingleOrDefaultAsync(
            x => x.CustomerBookId == CustomerBookId && x.BookshelfId == bookshelf.Id,
            cancellationToken
        );

        bookshelfBook = new BookshelfBook()
        {
            CustomerBookId = CustomerBookId,
            Isbn = customerBook.Isbn,
            BookshelfId = bookshelf.Id,
            CustomerBook = customerBook,
            Bookshelf = bookshelf,
            Order = dbContext.BookshelfBook.Where(x => x.BookshelfId == BookshelfId).Count() + 1,
        };
        dbContext.BookshelfBook.Add(bookshelfBook);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
