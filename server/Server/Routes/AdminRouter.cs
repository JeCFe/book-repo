using Microsoft.AspNetCore.Http.HttpResults;

namespace Server.Routes;

public static class AdminEndpoints
{
    private static Ok<string> HelloWorld(CancellationToken cancellationToken)
    {
        return TypedResults.Ok("Hello world");
    }

    public static RouteGroupBuilder MapAdminEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/hello", HelloWorld);
        return group;
    }
}
