namespace Server.Domain.Scalars;

using System.Text.Json;
using System.Text.Json.Serialization;

public class StringJsonConverter<T> : JsonConverter<T>
    where T : ICanBeAString<T>
{
    public override T? Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options
    )
    {
        var _ = T.TryParse(reader.GetString(), out var value);
        return value;
    }

    public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString());
    }
}
