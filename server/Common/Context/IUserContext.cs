namespace Server.Context;

using System.Security.Claims;

public interface IUserContext
{
    public ClaimsPrincipal? User { get; }
    public string? UserId { get; }
}
