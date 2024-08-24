namespace Server.Domain.Scalars;

using System.Diagnostics.CodeAnalysis;

public static class StringEnum
{
    public static bool TryParse<T>(ReadOnlySpan<char> s, [NotNullWhen(true)] out T? result)
        where T : class, IStringEnum<T> => TryParse(s, StringComparison.Ordinal, out result);

    public static bool TryParse<T>(
        ReadOnlySpan<char> s,
        StringComparison comparisonType,
        [NotNullWhen(true)] out T? result
    )
        where T : class, IStringEnum<T>
    {
        foreach (var prospectiveValue in T.Values)
        {
            if (s.Equals(prospectiveValue.ToString(), comparisonType))
            {
                result = prospectiveValue;
                return true;
            }
        }

        result = null;
        return false;
    }
}
