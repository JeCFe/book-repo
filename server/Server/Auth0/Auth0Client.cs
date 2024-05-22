using Auth0.Core.Exceptions;
using Auth0.ManagementApi;
using Microsoft.Extensions.Options;
using Server.Exceptions;

namespace Server.Auth0;

public class Auth0Client : IAuth0Client
{
    private readonly ManagementApiClient _client;
    private readonly IOptions<Auth0Options> _options;

    public Auth0Client(IOptions<Auth0Options> options, IAuth0Token token, HttpClient? client = null)
    {
        var accessToken = token.GetAccessToken(CancellationToken.None).Result;
        _options = options;
        _client = new ManagementApiClient(accessToken, options.Value.Domain);
    }

    public async Task Delete(string id)
    {
        await _client.Users.DeleteAsync(id);
        try
        {
            await _client.Users.GetAsync(id);
            throw new UnableToDeleteUserException();
        }
        catch (ErrorApiException) { }
    }
}
