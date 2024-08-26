namespace Common.MediatR;

using MediatR;
using Microsoft.EntityFrameworkCore;

public interface ICommand<TDbContext> : IRequest
    where TDbContext : DbContext
{
    Task Execute(TDbContext dbContext, CommandContext ctx, CancellationToken cancellationToken);
}

public interface ICommand<TDbContext, TResult> : IRequest<TResult>
    where TDbContext : DbContext
{
    Task<TResult> Execute(
        TDbContext dbContext,
        CommandContext ctx,
        CancellationToken cancellationToken
    );
}
