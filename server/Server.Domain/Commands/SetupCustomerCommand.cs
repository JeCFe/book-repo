namespace Server.Domain.Commands;

using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Models;

public class SetupCustomerCommand : ICommand<BookRepoContext>
{
    public required string Id { get; init; }
    public List<string>? BookshelvesNames { get; init; }
    public List<Book>? Books { get; init; }
    public bool IncludeDefaultBookshelves { get; init; }

    public async Task Execute(
        BookRepoContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    )
    {
        if (
            await dbContext.Customer.SingleOrDefaultAsync(x => x.Id == Id, cancellationToken) is { }
        )
        {
            return;
        }

        Customer customer = new() { Id = Id, CreationDate = ctx.time.GetUtcNow(), };

        var homelessBookBookshelf = new Bookshelf()
        {
            Id = Guid.NewGuid(),
            Name = "Homeless Books",
            CreationDate = ctx.time.GetUtcNow(),
            UpdatedDate = ctx.time.GetUtcNow(),
        };
        if (Books is { })
        {
            customer.Bookshelves =  [ ..customer.Bookshelves, homelessBookBookshelf ];
        }

        if (IncludeDefaultBookshelves)
        {
            customer.Bookshelves =
            [
                ..customer.Bookshelves,
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Wanting to read",
                    CreationDate = ctx.time.GetUtcNow(),
                    UpdatedDate = ctx.time.GetUtcNow(),
                    
                },
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Currently Reading",  
                    CreationDate = ctx.time.GetUtcNow(),
                    UpdatedDate = ctx.time.GetUtcNow(),
                    
                },
                new (){
                    Id = Guid.NewGuid(),
                    Name = "Read",
             
                    CreationDate = ctx.time.GetUtcNow(),
                    UpdatedDate = ctx.time.GetUtcNow(),
                    
                },
            ];
        }

        if (BookshelvesNames is { } names)
        {
            List<Bookshelf> customBookshelves =  [ ];
            foreach (var name in names)
            {
                customBookshelves.Add(
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = name,
                        CreationDate = DateTimeOffset.UtcNow
                    }
                );
            }
            customer.Bookshelves =  [ ..customer.Bookshelves, ..customBookshelves ];
        }

        dbContext.Customer.Add(customer);

        if (Books is { } books)
        {
            dbContext.Books.AddRange(Books);
            List<BookshelfBook> bookshelfBooks =  [ ];
            for (int i = 0; i < books.Count; i++)
            {
                bookshelfBooks.Add(
                    new BookshelfBook()
                    {
                        BookshelfId = homelessBookBookshelf.Id,
                        Isbn = books[i].Isbn,
                        Order = i,
                        Book = books[i],
                        Bookshelf = homelessBookBookshelf
                    }
                );
            }
            dbContext.BookshelfBook.AddRange(bookshelfBooks);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
