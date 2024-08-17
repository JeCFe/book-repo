namespace Server.Domain.Scalars;

public interface IStringEnum<T> : ICanBeAString<T>
    where T : IStringEnum<T>
{
    static abstract T[] Values { get; }

    public static virtual implicit operator string(T value) => value.ToString();

    public static virtual explicit operator T(string text) => text.Parse<T>();

    public static virtual string[] StringValues()
    {
        return T.Values.Select(x => x.ToString()).ToArray();
    }
}
