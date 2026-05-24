namespace Server.OpenLibrary;

using OpenLibraryNET.Data;
using OpenLibraryNET.Utility;
using Server.Domain.Models;
using Server.OpenLibrary.Blob;

public class OpenLibraryClient : IOpenLibraryClient
{
    private OpenLibraryNET.OpenLibraryClient _client;
    private IBlobClient _blobClient;

    public OpenLibraryClient(IBlobClient blobClient)
    {
        _client = new OpenLibraryNET.OpenLibraryClient();
        _blobClient = blobClient;
    }

    public async Task<string?> GetBookCover(string isbn)
    {
        try
        {
            var image = await _client.Image.GetCoverAsync(CoverIdType.ISBN, isbn, ImageSize.Large);
            return await _blobClient.UploadImageToBlobStorage(image, isbn);
        }
        catch
        {
            return null;
        }
    }

    public string? GetReleaseDate(OLEditionData data)
    {
        try
        {
            return data.ExtensionData?["publish_date"].ToString();
        }
        catch
        {
            return null;
        }
    }

    public async Task<List<string>?> GetAuthors(List<string> authorKeys)
    {
        var authorTasks = authorKeys.Select(k => _client.Author.GetDataAsync(k));
        var results = await Task.WhenAll(authorTasks);
        return results.Where(a => a is not null).Select(a => a!.Name).ToList();
    }

    public async Task<Book?> GetBook(string isbn, CancellationToken cancellationToken)
    {
        if ((await _client.Edition.GetDataByISBNAsync(isbn)) is not { } book)
        {
            return null;
        }

        return new Book()
        {
            Isbn = isbn,
            Name = book.Title,
            Release = GetReleaseDate(book),
            Picture = await GetBookCover(isbn),
            Subjects = [.. book.Subjects],
            PageCount = book.PageCount,
            Authors = await GetAuthors([.. book.AuthorKeys]),
        };
    }
}
