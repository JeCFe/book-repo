namespace Server.Domain.Models;

public class CustomerBook()
{
    public required Guid Id { get; init; }
    public required string CustomerId { get; init; }
    public required string Isbn { get; init; }
    public int Ranking { get; set; }
    public string? Comment { get; set; }
    public required Customer Customer { get; init; }
    public required Book Book { get; init; }
}
