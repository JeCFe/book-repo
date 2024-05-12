namespace Server.Domain.Models;

public record Book
{
    public required string Isbn { get; init; }
    public required string Name { get; set; }
    public required string Author { get; set; }
    public required string Release { get; set; }
    public required string Picture { get; set; }
}
