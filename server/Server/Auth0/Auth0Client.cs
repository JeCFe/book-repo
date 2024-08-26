using System.Net;
using Auth0.Core.Exceptions;
using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
using Common.Exceptions;
using Microsoft.Extensions.Options;
using Server.Models;

namespace Server.Auth0;

public class Auth0Client : IAuth0Client
{
    private readonly IManagementApiClient _client;

    public Auth0Client(
        IOptions<Auth0Options> options,
        IAuth0Token token,
        IManagementApiClient? client = null
    )
    {
        var accessToken = token.GetAccessToken(CancellationToken.None).Result;
        _client = client switch
        {
            { } => client,
            _ => new ManagementApiClient(accessToken, options.Value.Domain)
        };
    }

    public async Task Delete(string id, CancellationToken cancellationToken)
    {
        //Question: Why does DeleteAsync not take a cancellation token
        await _client.Users.DeleteAsync(id);
        try
        {
            await _client.Users.GetAsync(id, cancellationToken: cancellationToken);
            throw new UnableToDeleteUserException();
        }
        catch (ErrorApiException) { }
    }

    public async Task<User> Update(
        CustomerUpdateRequest request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            return await _client
                .Users
                .UpdateAsync(request.Id, new() { NickName = request.Nickname }, cancellationToken);
        }
        catch (ErrorApiException ex)
        {
            if (ex.StatusCode == HttpStatusCode.BadRequest)
            {
                throw new BadRequestException(ex.Message);
            }
            else if (ex.StatusCode == HttpStatusCode.NotFound)
            {
                throw new UserNotFoundException(ex.Message);
            }
            else
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
