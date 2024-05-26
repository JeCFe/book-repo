namespace Server.Domain.Models;

public record Book
{
    public required string Isbn { get; init; }
    public required string Name { get; set; }
    public List<string>? Authors { get; set; } = [ ];
    public List<string> Subjects { get; set; } = [ ];
    public string? Release { get; set; }
    public string? Picture { get; set; }
    public int PageCount { get; init; }
}
