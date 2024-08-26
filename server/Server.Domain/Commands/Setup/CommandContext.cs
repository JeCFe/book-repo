namespace Server.Domain.Commands;

using MediatR;

public record struct CommandContext(IPublisher Publisher, TimeProvider time)
{
    public readonly Task Publish<TNotification>(
        TNotification notification,
        CancellationToken cancellationToken
    )
        where TNotification : INotification
    {
        return Publisher.Publish(notification, cancellationToken);
    }
};
