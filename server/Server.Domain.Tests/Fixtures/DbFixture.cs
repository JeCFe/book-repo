namespace Server.Domain.Tests.Fixtures;

using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class DbFixture : IDisposable
{
    protected readonly SqliteConnection _connection;
    protected readonly DbContextOptions<BookRepoContext> _contextOptions;

    public DbFixture()
    {
        _connection = new SqliteConnection("Filename=:memory:");
        _connection.Open();

        _contextOptions = new DbContextOptionsBuilder<BookRepoContext>()
            .UseSqlite(_connection)
            .Options;
        using var context = new BookRepoContext(_contextOptions);
        context.Database.EnsureCreated();
    }

    public BookRepoContext CreateContext() => new BookRepoContext(_contextOptions);

    public void Dispose()
    {
        _connection.Dispose();
        GC.SuppressFinalize(this);
    }
}
