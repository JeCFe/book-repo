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

        var pictureUri = OpenLibraryUtility.BuildCoversUri(
            CoverIdType.ISBN,
            isbn,
            ImageSize.Medium
        );

        return new Book()
        {
            Isbn = isbn,
            Name = book.Title,
            Release = "Unknown",
            Picture = pictureUri.ToString(),
            Subjects =  [ .. book.Subjects ],
            PageCount = book.PageCount
        };
    }
}
