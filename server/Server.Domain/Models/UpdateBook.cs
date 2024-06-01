namespace Server.Domain.Models;

public record UpdateBook
{
    public required string Isbn { get; init; }
    public required int Order { get; init; }
}
