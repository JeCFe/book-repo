using Snapper;
using Snapper.Attributes;

namespace Server.Tests;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

public class SwaggerTesting
{
    [Fact, UpdateSnapshots]
    public async void SelfServeSnapshotTesting()
    {
        await using var application = new WebApplicationFactory<Program>();
        var client = application
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureAppConfiguration(config =>
                {
                    config.AddInMemoryCollection(
                        [
                            new("Auth0:ClientId", $"{Guid.NewGuid()}"),
                            new("Auth0:ClientSecret", $"{Guid.NewGuid()}"),
                            new("Auth0:Domain", "dev-yf34hkokp08w5btt.uk.auth0.com"),
                            new("Auth0:Audience", "/auth")
                        ]
                    );
                });
            })
            .CreateClient();
        var response = await client.GetAsync(
            "/swagger/common/swagger.json",
            CancellationToken.None
        );
        string actual = await response.Content.ReadAsStringAsync(CancellationToken.None);
        Assert.True(response.IsSuccessStatusCode, actual);
        actual.ShouldMatchSnapshot(SnapshotSettings.New().SnapshotFileName("api-spec"));
    }

    [Fact, UpdateSnapshots]
    public async void AdminSnapshotTesting()
    {
        await using var application = new WebApplicationFactory<Program>();
        var client = application
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureAppConfiguration(config =>
                {
                    config.AddInMemoryCollection(
                        [
                            new("Auth0:ClientId", $"{Guid.NewGuid()}"),
                            new("Auth0:ClientSecret", $"{Guid.NewGuid()}"),
                            new("Auth0:Domain", "dev-yf34hkokp08w5btt.uk.auth0.com"),
                            new("Auth0:Audience", "/auth")
                        ]
                    );
                });
            })
            .CreateClient();
        var response = await client.GetAsync("/swagger/admin/swagger.json", CancellationToken.None);
        string actual = await response.Content.ReadAsStringAsync(CancellationToken.None);
        Assert.True(response.IsSuccessStatusCode, actual);
        actual.ShouldMatchSnapshot(SnapshotSettings.New().SnapshotFileName("admin-api-spec"));
    }
}
