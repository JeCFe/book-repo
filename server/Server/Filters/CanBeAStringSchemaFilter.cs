namespace Server.Filter;

using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class CanBeAStringSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        var canBeAString = context.Type.GetInterfaces().Any(x => x.Name == "ICanBeAString`1");

        if (canBeAString)
        {
            // Reset the schema
            schema.Properties.Clear();
            schema.AdditionalPropertiesAllowed = true;
            schema.Required.Clear();

            // Set schema as string enum
            schema.Type = "string";
        }
    }
}
