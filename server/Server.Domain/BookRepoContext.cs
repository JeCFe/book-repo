namespace Server.Domain;

using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Models;

public class BookRepoContext : DbContext
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Bookshelf> Bookshelves { get; set; }
    public DbSet<Customer> Customer { get; set; }
    public DbSet<CustomerBook> CustomerBook { get; set; }

    public BookRepoContext() { }

    public BookRepoContext(DbContextOptions<BookRepoContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        modelBuilder.Entity<Customer>().HasKey(x => x.Id);
        modelBuilder.Entity<Customer>().HasIndex(X => X.CustomerId).IsUnique();
        modelBuilder.Entity<Book>().HasKey(x => x.Isbn);
        modelBuilder.Entity<CustomerBook>().HasKey(x => new { x.CustomerId, x.Isbn });
        modelBuilder.Entity<Bookshelf>().HasKey(x => x.Id);
        modelBuilder.Entity<Bookshelf>().HasMany(x => x.Books).WithMany(y => y.Bookshelves);
    }
}
