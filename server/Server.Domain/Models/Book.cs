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
    public List<BookError> BookErrors { get; set; } = [ ];

    public bool AddError(BookError error)
    {
        if (BookErrors.Where(x => x.Error == error.Error) is not { })
        {
            return false;
        }
        BookErrors.Add(error);
        return true;
    }
}
