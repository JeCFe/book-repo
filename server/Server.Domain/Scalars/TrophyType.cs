namespace Server.Domain.Scalars;

using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

[JsonConverter(typeof(StringJsonConverter<TrophyType>))]
public sealed record TrophyType : IStringEnum<TrophyType>
{
    public static readonly TrophyType Alerter = new("alerter");
    public static readonly TrophyType Basic = new("basic");
    public static readonly TrophyType BetaTester = new("beta-tester");
    public static readonly TrophyType Contributor = new("contributor");
    public static readonly TrophyType BookAddict = new("book-addict");
    public static readonly TrophyType Sponsor = new("sponsor");
    public static readonly TrophyType SharingIsCaring = new("sharing-is-caring");
    public static readonly TrophyType AvidReviewer = new("avid-reviewer");
    public static readonly TrophyType Commentator = new("commentator");
    public static readonly TrophyType GoalScored = new("goal-scored");
    public static readonly TrophyType GoalSetter = new("goal-setter");
    public static TrophyType[] Values =>
        [
            Alerter,
            Basic,
            BetaTester,
            Contributor,
            BookAddict,
            Sponsor,
            SharingIsCaring,
            AvidReviewer,
            Commentator,
            GoalScored,
            GoalSetter
        ];

    private readonly string _value;

    private TrophyType(string value)
    {
        _value = value;
    }

    public static bool TryParse(
        ReadOnlySpan<char> text,
        [NotNullWhen(true)] out TrophyType? value
    ) => StringEnum.TryParse(text, out value);
}
