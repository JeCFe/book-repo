namespace Server.Domain.Tests.Fixtures;

using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using Server.Domain;
using Server.Domain.Commands;

public class DbFixture : IDisposable
{
    protected readonly SqliteConnection _connection;
    protected readonly DbContextOptions<BookRepoContext> _contextOptions;
    private readonly IPublisher _publisher = new Mock<IMediator>().Object;

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

    public Task Execute(
        BookRepoContext dbContext,
        ICommand<BookRepoContext> command,
        string? user = null
    )
    {
        return command.Execute(
            dbContext,
            new(_publisher, TimeProvider.System, user ?? "Test User"),
            CancellationToken.None
        );
    }

    public async Task<TResult> Execute<TResult>(
        BookRepoContext dbContext,
        ICommand<BookRepoContext, TResult> command,
        string? user = null
    )
    {
        return await command.Execute(
            dbContext,
            new(_publisher, TimeProvider.System, user ?? "Test User"),
            CancellationToken.None
        );
    }

    public void Dispose()
    {
        _connection.Dispose();
        GC.SuppressFinalize(this);
    }
}
