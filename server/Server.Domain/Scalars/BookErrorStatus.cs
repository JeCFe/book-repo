namespace Server.Domain.Scalars;

using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

[JsonConverter(typeof(StringJsonConverter<TrophyType>))]
public sealed record BookErrorStatus : IStringEnum<BookErrorStatus>
{
    public static readonly BookErrorStatus Pending = new("pending");
    public static readonly BookErrorStatus Closed = new("closed");
    public static readonly BookErrorStatus Completed = new("completed");
    public static BookErrorStatus[] Values => [ Pending, Closed, Completed ];

    private readonly string _value;

    public override string ToString() => _value;

    private BookErrorStatus(string value)
    {
        _value = value;
    }

    public static bool TryParse(
        ReadOnlySpan<char> text,
        [NotNullWhen(true)] out BookErrorStatus? value
    ) => StringEnum.TryParse(text, out value);
}
