namespace Server.Domain.Commands;

using MediatR;
using Microsoft.EntityFrameworkCore;

public class CommandHandler<TDbContext, TCommand> : IRequestHandler<TCommand>
    where TCommand : ICommand<TDbContext>
    where TDbContext : DbContext
{
    private readonly TDbContext _dbContext;
    private readonly IPublisher _mediator;

    public CommandHandler(TDbContext dbContext, IPublisher mediator)
    {
        _dbContext = dbContext;
        _mediator = mediator;
    }

    public Task Handle(TCommand cmd, CancellationToken cancellationToken) =>
        cmd.Execute(_dbContext, new(_mediator), cancellationToken);
}

public class CommandHandler<TDbContext, TCommand, TResult> : IRequestHandler<TCommand, TResult>
    where TCommand : ICommand<TDbContext, TResult>
    where TDbContext : DbContext
{
    private readonly TDbContext _dbContext;
    private readonly IPublisher _mediator;

    public CommandHandler(TDbContext dbContext, IPublisher mediator)
    {
        _dbContext = dbContext;
        _mediator = mediator;
    }

    public Task<TResult> Handle(TCommand cmd, CancellationToken cancellationToken) =>
        cmd.Execute(_dbContext, new(_mediator), cancellationToken);
}
