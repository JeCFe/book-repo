namespace Server.Domain;

using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Models;
using Server.Domain.Scalars;

public class BookRepoContext : DbContext
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Bookshelf> Bookshelves { get; set; }
    public DbSet<Customer> Customer { get; set; }

    public DbSet<BookshelfBook> BookshelfBook { get; set; }
    public DbSet<CustomerBook> CustomerBooks { get; set; }
    public DbSet<Shareable> Shareables { get; set; }
    public DbSet<Trophy> Trophies { get; set; }
    public DbSet<BookError> BookErrors { get; set; }

    public BookRepoContext() { }

    public BookRepoContext(DbContextOptions<BookRepoContext> options)
        : base(options) { }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Conventions.Add(_ => new StringEnumConstraintConvention());
        base.ConfigureConventions(configurationBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        modelBuilder.Entity<AdminComment>().HasKey(x => new { x.AdminUsername, x.Created });

        modelBuilder
            .Entity<BookError>()
            .Property(x => x.Error)
            .HasStringEnumConversion()
            .HasMaxLength(BookErrorType.Values.Max(x => x.ToString().Length));

        modelBuilder
            .Entity<BookError>()
            .Property(x => x.Status)
            .HasStringEnumConversion()
            .HasMaxLength(BookErrorStatus.Values.Max(x => x.ToString().Length));

        modelBuilder.Entity<BookError>().HasKey(x => new { x.Isbn, x.Error });

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

        modelBuilder.Entity<Trophy>().Property(x => x.Id).ValueGeneratedOnAdd();

        modelBuilder
            .Entity<Trophy>()
            .HasDiscriminator<string>("TrophyType")
            .HasValue<BetaTester>("BetaTester")
            .HasValue<Contributor>("Contributor")
            .HasValue<BookAddict>("BookAddict")
            .HasValue<Sponsor>("Sponsor")
            .HasValue<SharingIsCaring>("SharingIsCaring")
            .HasValue<AvidReviewer>("AvidReviewer")
            .HasValue<Commentator>("Commentator");
    }
}
