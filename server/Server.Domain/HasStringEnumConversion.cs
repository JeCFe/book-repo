using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Server.Domain.Scalars;

namespace Server.Domain;

public static class PropertyBuilderExtensionss
{
    public static PropertyBuilder<T> HasStringEnumConversion<T>(this PropertyBuilder<T> builder)
        where T : class, IStringEnum<T>
    {
        var values = T.StringValues();
        builder
            .HasConversion<StringEnumValueConverter<T>>()
            .SetStringEnumConversionValues(values)
            .HasMaxLength(values.Max(x => x.Length));
        return builder;
    }

    public static PropertyBuilder SetStringEnumConversionValues(
        this PropertyBuilder builder,
        string[] values
    )
    {
        builder.Metadata[StringEnumConstraintConvention.StringEnumValuesKey] = values;
        return builder;
    }
}

public class StringEnumConstraintConvention : IModelFinalizingConvention
{
    public const string StringEnumValuesKey = "StringEnumValues";

    public void ProcessModelFinalizing(
        IConventionModelBuilder modelBuilder,
        IConventionContext<IConventionModelBuilder> context
    )
    {
        foreach (var entityType in modelBuilder.Metadata.GetEntityTypes())
        {
            // Ignore owned types
            if (entityType.IsOwned())
            {
                continue;
            }

            foreach (var property in entityType.GetDeclaredProperties())
            {
                if (property.Builder.Metadata[StringEnumValuesKey] is string[] values)
                {
                    var tableName = entityType.GetTableName();
                    var columnName = property.GetColumnName();

                    var sql = $"{columnName} IN ('{string.Join("', '", values)}')";
                    entityType.AddCheckConstraint($"CK_{tableName}_{columnName}", sql);
                }
            }
        }
    }
}
