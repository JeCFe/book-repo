namespace Server.Filters;

using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using static Common.Scalars.StringEnumValues;

public class StringEnumParamFilter : IParameterFilter
{
    public void Apply(OpenApiParameter parameter, ParameterFilterContext context)
    {
        var getStringValues =
            GetStringValuesMethod(context.ApiParameterDescription.Type)
            ?? context
                .ApiParameterDescription
                .Type
                .GetInterfaces()
                .Select(GetStringValuesMethod)
                .FirstOrDefault();

        if (getStringValues != null)
        {
            parameter.Schema.Enum = getStringValues()
                .Select(x => new OpenApiString(x))
                .ToList<IOpenApiAny>();
        }
    }
}
