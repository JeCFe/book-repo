namespace Server.Filters;

using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using static StringEnumValues;

public class StringEnumSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        var getStringValues =
            GetStringValuesMethod(context.Type)
            ?? context.Type.GetInterfaces().Select(GetStringValuesMethod).FirstOrDefault();

        if (getStringValues != null)
        {
            schema.Enum = new List<IOpenApiAny>(
                getStringValues().Select(x => new OpenApiString(x))
            );

            var x = getStringValues().Select(x => new OpenApiString(x));
        }
    }
}
