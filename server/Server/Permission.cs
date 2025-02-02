namespace Server;

using Microsoft.AspNetCore.Authorization;

public class Permission
{
    public static readonly string Admin = "bookrepo.admin";

    public static readonly AuthorizationPolicy BookRepoAdmin = new AuthorizationPolicyBuilder()
        .RequireClaim("permissions", Admin)
        .Build();
}
