namespace Common.MediatR;

using MediatR;
using Microsoft.EntityFrameworkCore;

public class CommandHandler<TDbContext, TCommand>(
    TDbContext dbContext,
    IPublisher mediator,
    TimeProvider time
) : IRequestHandler<TCommand>
    where TCommand : ICommand<TDbContext>
    where TDbContext : DbContext
{
    public Task Handle(TCommand cmd, CancellationToken cancellationToken) =>
        cmd.Execute(dbContext, new(mediator, time, "Unknown"), cancellationToken);
}

public class CommandHandler<TDbContext, TCommand, TResult>(
    TDbContext dbContext,
    IPublisher mediator,
    TimeProvider time
) : IRequestHandler<TCommand, TResult>
    where TCommand : ICommand<TDbContext, TResult>
    where TDbContext : DbContext
{
    public Task<TResult> Handle(TCommand cmd, CancellationToken cancellationToken) =>
        cmd.Execute(dbContext, new(mediator, time, "Unknown"), cancellationToken);
}
