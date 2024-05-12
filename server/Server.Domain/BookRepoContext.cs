namespace Server.Domain;

using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Models;

public class BookRepoContext : DbContext
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Bookshelf> Bookshelves { get; set; }
    public DbSet<Bookshelf> Customer { get; set; }

    public BookRepoContext() { }

    public BookRepoContext(DbContextOptions<BookRepoContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        modelBuilder.Entity<Customer>().HasKey(x => x.Id);
        modelBuilder.Entity<Book>().HasKey(x => x.Isbn);

        modelBuilder
            .Entity<Customer>()
            .HasMany(customer => customer.Bookshelves)
            .WithOne(bookshelf => bookshelf.Customer)
            .HasForeignKey(bookshelf => bookshelf.CustomerId);
    }
}
