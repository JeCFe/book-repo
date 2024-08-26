namespace Common.Scalars;

public class StringEnumValues
{
    public static Func<string[]>? GetStringValuesMethod(Type type)
    {
        var method = type.GetMethods()
            .SingleOrDefault(
                x =>
                    x.Name == "StringValues"
                    && x.IsStatic
                    && x.ReturnType == typeof(string[])
                    && x.GetParameters().Length == 0
            );

        if (method != null)
        {
            return () => (string[])method.Invoke(null, [ ])!;
        }

        return null;
    }
}
