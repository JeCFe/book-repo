using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace Server.Auth0;

public class Auth0Token(IOptions<Auth0Options> options) : IAuth0Token
{
    public async Task<string> GetAccessToken(CancellationToken cancellationToken)
    {
        HttpRequestMessage request = new HttpRequestMessage(
            HttpMethod.Post,
            $"https://{options.Value.Domain}/oauth/token"
        );
        var contentHeader = new MediaTypeHeaderValue("application/json")
        {
            CharSet = Encoding.UTF8.WebName
        };
        var content = new ManagementTokenRequestContent()
        {
            client_id = options.Value.ClientId,
            client_secret = options.Value.ClientSecret,
            audience = options.Value.Audience,
            grant_type = options.Value.GrantType
        };
        request.Content = JsonContent.Create(content, contentHeader);
        var response = await new HttpClient().SendAsync(request, cancellationToken);

        var token = await response.Content.ReadFromJsonAsync<ManagementTokenResponse>();

        return token!.Token;
    }
}

public class ManagementTokenResponse
{
    [JsonPropertyName("access_token")]
    public string Token { get; set; } = string.Empty;

    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;
}

public class ManagementTokenRequestContent
{
    public string client_id { get; set; } = string.Empty;

    public string client_secret { get; set; } = string.Empty;

    public string audience { get; set; } = string.Empty;

    public string grant_type { get; set; } = string.Empty;
}
