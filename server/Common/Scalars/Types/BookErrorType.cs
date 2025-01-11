namespace Common.Scalars.Types;

using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

[JsonConverter(typeof(StringJsonConverter<BookErrorType>))]
public sealed record BookErrorType : IStringEnum<BookErrorType>
{
    public static readonly BookErrorType Title = new("title");
    public static readonly BookErrorType Picture = new("picture");
    public static readonly BookErrorType Author = new("author");
    public static readonly BookErrorType Release = new("release");
    public static readonly BookErrorType Subjects = new("subjects");
    public static readonly BookErrorType Pages = new("pages");
    public static BookErrorType[] Values => [ Title, Picture, Author, Release, Subjects, Pages ];

    private readonly string _value;

    public override string ToString() => _value;

    private BookErrorType(string value)
    {
        _value = value;
    }

    public static bool TryParse(
        ReadOnlySpan<char> text,
        [NotNullWhen(true)] out BookErrorType? value
    ) => StringEnum.TryParse(text, out value);
}
