using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Domain.Scalars;

namespace Server.Domain;

public class StringEnumValueConverter<T> : ValueConverter<T, string>
    where T : class, IStringEnum<T>
{
    public StringEnumValueConverter()
        : base(v => v.ToString(), v => v.Parse<T>()) { }
}
