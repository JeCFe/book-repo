namespace Common.MediatR;

using global::MediatR;
using Common.Context;
using Microsoft.EntityFrameworkCore;

public class CommandHandler<TDbContext, TCommand>(
    TDbContext dbContext,
    IPublisher mediator,
    TimeProvider time,
    IUserContext userContext
) : IRequestHandler<TCommand>
    where TCommand : ICommand<TDbContext>
    where TDbContext : DbContext
{
    public Task Handle(TCommand cmd, CancellationToken cancellationToken) =>
        cmd.Execute(
            dbContext,
            new(mediator, time, userContext.User?.Identity?.Name ?? "Unknown"),
            cancellationToken
        );
}

public class CommandHandler<TDbContext, TCommand, TResult>(
    TDbContext dbContext,
    IPublisher mediator,
    TimeProvider time,
    IUserContext userContext
) : IRequestHandler<TCommand, TResult>
    where TCommand : ICommand<TDbContext, TResult>
    where TDbContext : DbContext
{
    public Task<TResult> Handle(TCommand cmd, CancellationToken cancellationToken) =>
        cmd.Execute(
            dbContext,
            new(mediator, time, userContext.User?.Identity?.Name ?? "Unknown"),
            cancellationToken
        );
}
