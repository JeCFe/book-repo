using Microsoft.AspNetCore.Http.HttpResults;

namespace Server.Routes;

public static class AuthRouter
{

    public static Ok<string> GetAuthTest()
    {
        return TypedResults.Ok("Woo authed");
    }

    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Auth");
        group.MapGet("/", GetAuthTest).RequireAuthorization();
        return group;
    }
}