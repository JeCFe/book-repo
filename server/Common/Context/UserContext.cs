namespace Common.Context;

using System.Security.Claims;
using Microsoft.AspNetCore.Http;

public class UserContext : IUserContext
{
    public ClaimsPrincipal User { get; }
    public string? UserId { get; }

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        if (httpContextAccessor != null && httpContextAccessor.HttpContext != null)
        {
            User = httpContextAccessor.HttpContext.User;
            UserId =
                User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new InvalidOperationException("Users 'NameIdentifier' is null");
        }
        else
        {
            User = new ClaimsPrincipal();
            UserId = null;
        }
    }
}
