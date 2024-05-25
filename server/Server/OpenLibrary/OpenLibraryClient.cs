namespace Server.OpenLibrary;

using System.Runtime.Intrinsics.X86;
using System.Text;
using OpenLibraryNET;
using OpenLibraryNET.Data;
using OpenLibraryNET.Utility;
using Server.Domain.Models;

public class OpenLibraryClient : IOpenLibraryCient
{
    private OpenLibraryNET.OpenLibraryClient _client;

    public OpenLibraryClient()
    {
        _client = new OpenLibraryNET.OpenLibraryClient();
    }

    public async Task<Book?> GetBook(string isbn, CancellationToken cancellationToken)
    {
        OLEditionData? book = await _client.Edition.GetDataByISBNAsync(isbn);

        if (book is null)
        {
            return null;
        }
        List<string> authors =  [ ];
        foreach (var i in book.AuthorKeys)
        {
            var author = await _client.Author.GetDataAsync(i);
            if (author is not null)
            {
                authors.Add(author.Name);
            }
        }
        var publishDate = "";
        try
        {
            publishDate = book.ExtensionData?["publish_date"].ToString();
        }
        catch { }

        var pictureUri = OpenLibraryUtility.BuildCoversUri(CoverIdType.ISBN, isbn, ImageSize.Large);

        return new Book()
        {
            Isbn = isbn,
            Name = book.Title,
            Release = publishDate ?? "Unknown",
            Picture = pictureUri.ToString(),
            Subjects =  [ .. book.Subjects ],
            PageCount = book.PageCount,
            Authors =  [ ..authors ]
        };
    }
}
