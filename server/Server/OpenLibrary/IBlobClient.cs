namespace Server.OpenLibrary.Blob;

public interface IBlobClient
{
    public Task<string> UploadImageToBlobStorage(byte[] imageBytes, string isbn);
}
