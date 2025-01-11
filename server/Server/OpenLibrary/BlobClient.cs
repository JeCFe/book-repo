using Azure.Storage.Blobs;
using Microsoft.Extensions.Options;

namespace Server.OpenLibrary.Blob;

public class BlobClient(IOptions<BlobOptions> options, BlobContainerClient? containerClient = null)
    : IBlobClient
{
    private readonly BlobContainerClient _containerClient = containerClient switch
    {
        { } => containerClient,
        _
            => new BlobServiceClient(options.Value.ConnectionString).GetBlobContainerClient(
                options.Value.ContainerName
            )
    };

    public async Task<string> UploadImageToBlobStorage(byte[] imageBytes, string isbn)
    {
        string blobName = string.Format($"{isbn}.jpg", Guid.NewGuid().ToString());
        var blobClient = _containerClient.GetBlobClient(blobName);
        await blobClient.UploadAsync(new MemoryStream(imageBytes), true);
        return blobClient.Uri.ToString();
    }
}
