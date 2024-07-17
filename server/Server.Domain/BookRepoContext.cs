namespace Server.Domain;

using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Models;

public class BookRepoContext : DbContext
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Bookshelf> Bookshelves { get; set; }
    public DbSet<Customer> Customer { get; set; }

    public DbSet<BookshelfBook> BookshelfBook { get; set; }
    public DbSet<CustomerBook> CustomerBooks { get; set; }
    public DbSet<Shareable> Shareables { get; set; }

    public BookRepoContext() { }

    public BookRepoContext(DbContextOptions<BookRepoContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        modelBuilder.Entity<Customer>().HasKey(x => x.Id);

        modelBuilder.Entity<Book>().HasKey(x => x.Isbn);

        modelBuilder.Entity<BookshelfBook>().HasKey(x => new { x.BookshelfId, x.CustomerBookId });
        modelBuilder.Entity<BookshelfBook>().HasIndex(x => x.Isbn);

        modelBuilder.Entity<Bookshelf>().Property(x => x.CustomerId).IsRequired();
        modelBuilder.Entity<Bookshelf>().HasKey(x => x.Id);

        modelBuilder.Entity<CustomerBook>().HasKey(x => x.Id);
        modelBuilder.Entity<CustomerBook>().HasIndex(x => new { x.CustomerId, x.Id }).IsUnique();
        modelBuilder.Entity<CustomerBook>().HasIndex(x => x.Isbn);

        modelBuilder.Entity<ShareableBookshelf>().Property(x => x.Id).ValueGeneratedOnAdd();
        modelBuilder.Entity<ShareableBookShowcase>().Property(x => x.Id).ValueGeneratedOnAdd();
    }
}
