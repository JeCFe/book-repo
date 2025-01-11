using Auth0.Core.Exceptions;
using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
using Common.Exceptions;
using Microsoft.Extensions.Options;
using Moq;
using Server.Auth0;
using Server.Models;

namespace Server.Tests.Clients;

public class Auth0ClientTests
{
    private readonly Mock<IAuth0Token> _mockToken;
    private readonly Mock<IManagementApiClient> _mockApiClient;
    private readonly IOptions<Auth0Options> _options = Options.Create<Auth0Options>(
        new()
        {
            ClientId = "DummyId",
            Domain = "Domain",
            Audience = "Audience",
            ClientSecret = "ClientSecret",
            GrantType = "GrantType"
        }
    );

    public Auth0ClientTests()
    {
        _mockToken = new Mock<IAuth0Token>();
        _mockApiClient = new Mock<IManagementApiClient>();
        _mockToken.Setup(x => x.GetAccessToken(It.IsAny<CancellationToken>())).ReturnsAsync("123");
    }

    [Fact]
    public async Task Will_delete_user()
    {
        _mockApiClient.Setup(x => x.Users.DeleteAsync(It.IsAny<string>())).Verifiable();
        _mockApiClient
            .Setup(
                x => x.Users.GetAsync(It.IsAny<string>(), null, true, It.IsAny<CancellationToken>())
            )
            .ThrowsAsync(new ErrorApiException()) // Counter intuitive - throws this when deleting has been succesful as this means no user was returned
            .Verifiable();

        var client = new Auth0Client(_options, _mockToken.Object, _mockApiClient.Object);

        await client.Delete("123", CancellationToken.None);

        _mockApiClient.VerifyAll();
    }

    [Fact]
    public async Task Will_throw_excpetion_when_failing_to_delete_user()
    {
        _mockApiClient.Setup(x => x.Users.DeleteAsync(It.IsAny<string>())).Verifiable();
        _mockApiClient
            .Setup(
                x => x.Users.GetAsync(It.IsAny<string>(), null, true, It.IsAny<CancellationToken>())
            )
            .ReturnsAsync(new User() { })
            .Verifiable();

        var client = new Auth0Client(_options, _mockToken.Object, _mockApiClient.Object);

        await Assert.ThrowsAsync<UnableToDeleteUserException>(
            async () => await client.Delete("12345678", CancellationToken.None)
        );

        _mockApiClient.VerifyAll();
    }

    [Fact]
    public async Task Will_successfully_update_user()
    {
        var request = new CustomerUpdateRequest()
        {
            Id = Guid.NewGuid().ToString(),
            Nickname = "Bob"
        };
        _mockApiClient
            .Setup(
                x =>
                    x.Users.UpdateAsync(
                        It.IsAny<string>(),
                        It.IsAny<UserUpdateRequest>(),
                        It.IsAny<CancellationToken>()
                    )
            )
            .ReturnsAsync(new User() { })
            .Verifiable();
        var client = new Auth0Client(_options, _mockToken.Object, _mockApiClient.Object);

        await client.Update(request, CancellationToken.None);

        _mockApiClient.VerifyAll();
    }

    [Fact]
    public async Task Will_throw_exception_when_user_not_found()
    {
        var request = new CustomerUpdateRequest()
        {
            Id = Guid.NewGuid().ToString(),
            Nickname = "Bob"
        };
        _mockApiClient
            .Setup(
                x =>
                    x.Users.UpdateAsync(
                        It.IsAny<string>(),
                        It.IsAny<UserUpdateRequest>(),
                        It.IsAny<CancellationToken>()
                    )
            )
            .ThrowsAsync(new ErrorApiException(System.Net.HttpStatusCode.NotFound))
            .Verifiable();
        var client = new Auth0Client(_options, _mockToken.Object, _mockApiClient.Object);

        await Assert.ThrowsAsync<UserNotFoundException>(
            async () => await client.Update(request, CancellationToken.None)
        );

        _mockApiClient.VerifyAll();
    }

    [Fact]
    public async Task Will_throw_exception_with_a_bad_request()
    {
        var request = new CustomerUpdateRequest()
        {
            Id = Guid.NewGuid().ToString(),
            Nickname = "Bob"
        };
        _mockApiClient
            .Setup(
                x =>
                    x.Users.UpdateAsync(
                        It.IsAny<string>(),
                        It.IsAny<UserUpdateRequest>(),
                        It.IsAny<CancellationToken>()
                    )
            )
            .ThrowsAsync(new ErrorApiException(System.Net.HttpStatusCode.BadRequest))
            .Verifiable();
        var client = new Auth0Client(_options, _mockToken.Object, _mockApiClient.Object);

        await Assert.ThrowsAsync<BadRequestException>(
            async () => await client.Update(request, CancellationToken.None)
        );

        _mockApiClient.VerifyAll();
    }
}
