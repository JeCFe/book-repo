using Auth0.ManagementApi.Models;
using Server.Models;

namespace Server.Auth0;

public interface IAuth0Client
{
    public Task Delete(string id, CancellationToken cancellationToken);
    public Task<User> Update(CustomerUpdateRequest request, CancellationToken cancellationToken);
}
