namespace Server.Models;

public record CustomerUpdateRequest
{
    public string? Nickname { get; init; }
}
