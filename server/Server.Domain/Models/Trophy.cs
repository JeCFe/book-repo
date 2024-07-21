namespace Server.Domain.Models;

public abstract record Trophy
{
    public Trophy(string description)
    {
        Description = description;
    }

    public Guid Id { get; init; }
    public required string Description { get; set; }
    public DateTimeOffset DateAchieved { get; init; } = DateTimeOffset.UtcNow;

    public virtual bool CheckApproval() => true;
}

public record BetaTester(BetaTestOptions Options) : Trophy("Thank you for being a beta tester!")
{
    public required DateTimeOffset DateJoined { get; init; }

    public override bool CheckApproval() => Options.Enabled;
}

public record Contributor() : Trophy("Thank you for contributing!")
{
    public required string PRContributed { get; init; }
}

public record BookAddict(int amount) : Trophy("You've added over 1000 books! Wowie!")
{
    private const int _bookAddictThreshold = 1000;

    public override bool CheckApproval() => amount >= _bookAddictThreshold;
}

public record Sponsor() : Trophy("Thank you for sponsoring, our infra bills thank you") { }

public record SharingIsCaring(int amount) : Trophy("You've created 10 sharable links!")
{
    private const int _sharedThreshold = 1000;

    public override bool CheckApproval() => amount >= _sharedThreshold;
}

public record AvidReviewer(int amount) : Trophy("You've rated over 100 books! Keep it up!")
{
    public required float AvgRating { get; init; }
    private const int _reviewrThreshold = 100;

    public override bool CheckApproval() => amount >= _reviewrThreshold;
}

public record Commentator(int amount) : Trophy("You've added over 100 comments to books!")
{
    private const int _commentatorThreshold = 100;

    public override bool CheckApproval() => amount >= _commentatorThreshold;
}

public record GoalScored(int amount)
    : Trophy("You've completed over 10 goals! Keep on the good work!")
{
    private const int _goalScoredThreshold = 10;

    public override bool CheckApproval() => amount >= _goalScoredThreshold;
}

public record GoalSetter(int amount) : Trophy("You've set yourself over 10 goals! Good luck!")
{
    private const int _goalSetterThreshold = 10;

    public override bool CheckApproval() => amount >= _goalSetterThreshold;
}

public record Alerter(int amount)
    : Trophy("You've alerted the admins to over 100 Open Library issues!")
{
    private const int _goalSetterThreshold = 10;

    public override bool CheckApproval() => amount >= _goalSetterThreshold;
}
