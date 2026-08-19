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
        var customerBook = await dbContext
            .CustomerBooks.Include(x => x.Book)
            .SingleOrDefaultAsync(
                x => x.Id == CustomerBookId && x.CustomerId == CustomerId,
                cancellationToken
            );

        var bookshelf = await dbContext.Bookshelves.SingleOrDefaultAsync(
            x => x.Id == BookshelfId && x.CustomerId == CustomerId,
            cancellationToken
        );

        if (customerBook == null)
        {
            throw new CustomerBookNotFoundException();
        }

        if (bookshelf == null)
        {
            throw new BookshelfNotFound();
        }

        if (
            await dbContext.BookshelfBook.AnyAsync(
                x => x.CustomerBookId == CustomerBookId && x.BookshelfId == BookshelfId,
                cancellationToken
            )
        )
        {
            return;
        }

        var bookshelfBook = new BookshelfBook()
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
