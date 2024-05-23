namespace Server.Models;

public record CustomerUpdateRequest
{
    public required string Id { get; init; }
    public string? Nickname { get; init; }
}
