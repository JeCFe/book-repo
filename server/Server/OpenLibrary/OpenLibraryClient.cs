namespace Server.OpenLibrary;

using OpenLibraryNET.Data;
using OpenLibraryNET.Utility;
using Server.Domain.Models;
using Server.OpenLibrary.Blob;

public class OpenLibraryClient : IOpenLibraryCient
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
        List<string> authors =  [ ];
        foreach (var i in authorKeys)
        {
            var author = await _client.Author.GetDataAsync(i);
            if (author is not null)
            {
                authors.Add(author.Name);
            }
        }
        return authors;
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
            Subjects =  [ .. book.Subjects ],
            PageCount = book.PageCount,
            Authors = await GetAuthors([ .. book.AuthorKeys ])
        };
    }
}
