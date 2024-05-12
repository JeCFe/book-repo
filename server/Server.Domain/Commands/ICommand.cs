namespace Server.Domain.Commands;

using MediatR;

public interface ICommand<TDBContext> : IRequest
    where TDBContext : BookRepoContext
{
    Task Execute(TDBContext context, IPublisher publisher, CancellationToken cancellationToken);
}

public interface ICommand : ICommand<BookRepoContext> { }
