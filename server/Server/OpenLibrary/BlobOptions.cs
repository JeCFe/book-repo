namespace Server.OpenLibrary.Blob;

public record BlobOptions
{
    public required string ConnectionString { get; init; }
    public required string ContainerName { get; init; }
}
