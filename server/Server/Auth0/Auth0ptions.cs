namespace Server.Auth0;

public record Auth0Options
{
    public required string Domain { get; init; }
    public required string ClientId { get; init; }
    public required string Audience { get; init; }
    public required string ClientSecret { get; init; }
    public required string GrantType { get; init; }
}
