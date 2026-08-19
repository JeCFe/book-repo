namespace Server.Auth0;

public interface IAuth0Token
{
    public Task<string> GetAccessToken(CancellationToken cancellationToken);
}
