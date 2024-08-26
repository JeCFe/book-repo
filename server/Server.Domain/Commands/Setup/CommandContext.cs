namespace Server.Domain.Commands;

using MediatR;
using Server.Context;

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
