namespace Server.Domain.Models;

public abstract record Trophy
{
    public Trophy(string description)
    {
        Description = description;
    }

    public Trophy() { }

    public Guid Id { get; init; }
    public string Description { get; set; } = "Not set";
    public DateTimeOffset DateAchieved { get; init; } = DateTimeOffset.UtcNow;

    public virtual bool CheckApproval() => true;
}

public sealed record BetaTester : Trophy
{
    private readonly bool _isBeta;

    public BetaTester() { }

    public BetaTester(bool isBeta)
        : base("Thank you for being a beta tester!") => _isBeta = isBeta;

    public required DateTimeOffset DateJoined { get; init; }

    public override bool CheckApproval() => _isBeta;
}

public sealed record Contributor() : Trophy("Thank you for contributing!")
{
    public required string PRContributed { get; init; }
}

public sealed record BookAddict : Trophy
{
    private const int _bookAddictThreshold = 1000;
    private readonly int _amount;

    public BookAddict() { }

    public BookAddict(int amount)
        : base("You've added over 1000 books! Wowie!") => _amount = amount;

    public override bool CheckApproval() => _amount >= _bookAddictThreshold;
}

public sealed record Sponsor() : Trophy("Thank you for sponsoring, our infra bills thank you") { }

public sealed record SharingIsCaring : Trophy
{
    private const int _sharedThreshold = 1000;
    private readonly int _amount;

    public SharingIsCaring() { }

    public SharingIsCaring(int amount)
        : base("You've created 10 sharable links!") => _amount = amount;

    public override bool CheckApproval() => _amount >= _sharedThreshold;
}

public sealed record AvidReviewer : Trophy
{
    private const int _reviewrThreshold = 100;
    private readonly int _amount;

    public AvidReviewer(int amount)
        : base("You've rated over 100 books! Keep it up!") => _amount = amount;

    public AvidReviewer() { }

    public override bool CheckApproval() => _amount >= _reviewrThreshold;
}

public sealed record Commentator : Trophy
{
    private const int _commentatorThreshold = 100;
    private readonly int _amount;

    public Commentator() { }

    public Commentator(int amount)
        : base("You've added over 100 comments to books!") => _amount = amount;

    public override bool CheckApproval() => _amount >= _commentatorThreshold;
}

public sealed record GoalScored : Trophy
{
    private const int _goalScoredThreshold = 10;
    private readonly int _amount;

    public GoalScored() { }

    public GoalScored(int amount)
        : base("You've completed over 10 goals! Keep on the good work!") => _amount = amount;

    public override bool CheckApproval() => _amount >= _goalScoredThreshold;
}

public sealed record GoalSetter : Trophy
{
    private const int _goalSetterThreshold = 10;
    private readonly int _amount;

    public GoalSetter() { }

    public GoalSetter(int amount)
        : base("You've set yourself over 10 goals! Good luck!") => _amount = amount;

    public override bool CheckApproval() => _amount >= _goalSetterThreshold;
}

public sealed record Alerter : Trophy
{
    private const int _goalSetterThreshold = 10;
    private readonly int _amount;

    public Alerter() { }

    public Alerter(int amount)
        : base("You've alerted the admins to over 100 Open Library issues!") => _amount = amount;

    public override bool CheckApproval() => _amount >= _goalSetterThreshold;
}
