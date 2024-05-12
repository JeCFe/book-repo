namespace Server.Helpers;

public class Clock : IClock
{
    public DateTimeOffset UtcNow
    {
        get { return DateTimeOffset.UtcNow; }
    }
}
