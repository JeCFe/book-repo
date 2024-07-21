namespace Server.Domain.Models;

public record BetaTestOptions
{
    public required bool Enabled { get; init; }
}
