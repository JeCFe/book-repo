namespace Common.Scalars;

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class StringEnumValueConverter<T> : ValueConverter<T, string>
    where T : class, IStringEnum<T>
{
    public StringEnumValueConverter()
        : base(v => v.ToString(), v => v.Parse<T>()) { }
}
