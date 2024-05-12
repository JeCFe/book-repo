namespace Server.Helpers;

public interface IClock
{
    public DateTimeOffset UtcNow { get; }
}
