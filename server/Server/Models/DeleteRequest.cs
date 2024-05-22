namespace Server.Models;

public record DeleteRequest
{
    public required string Id { get; init; }
}
