using System.Diagnostics.CodeAnalysis;

namespace Server.Domain.Scalars;

public interface ICanBeAString<T>
    where T : ICanBeAString<T>?
{
    string ToString();
    static abstract bool TryParse(ReadOnlySpan<char> text, [NotNullWhen(true)] out T? value);
}

public static class CanBeAStringExtentions
{
    public static T Parse<T>(this string text)
        where T : ICanBeAString<T>
    {
        if (T.TryParse(text, out var value))
        {
            return value;
        }
        throw new ArgumentOutOfRangeException(nameof(text));
    }
}
