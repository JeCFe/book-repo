namespace Server.filters;

using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class NullabilityFilter : ISchemaFilter
{
    private readonly ISerializerDataContractResolver _serializerDataContractResolver;

    public NullabilityFilter(ISerializerDataContractResolver serializerDataContractResolver)
    {
        _serializerDataContractResolver = serializerDataContractResolver;
    }

    public void Apply(OpenApiSchema openApiSchema, SchemaFilterContext schemaFilterContext)
    {
        var context = _serializerDataContractResolver.GetDataContractForType(
            schemaFilterContext.Type
        );

        if (context.ObjectProperties != null)
        {
            foreach (var item in context.ObjectProperties)
            {
                if (!openApiSchema.Properties.ContainsKey(item.Name))
                {
                    continue;
                }
                var isNonNullableValueType = item.MemberType.IsValueType && !item.IsNullable;
                var isNonNullableReferenceType =
                    item.MemberInfo.IsNonNullableReferenceType() == true;
                if (isNonNullableReferenceType || isNonNullableValueType)
                {
                    openApiSchema.Required.Add(item.Name);
                }
                else
                {
                    openApiSchema.Properties[item.Name].Nullable = false;
                }
            }
        }
    }
}
