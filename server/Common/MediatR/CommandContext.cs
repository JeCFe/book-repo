namespace Common.MediatR;

using global::MediatR;

public record struct CommandContext(IPublisher Publisher, TimeProvider Time, string userName)
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
