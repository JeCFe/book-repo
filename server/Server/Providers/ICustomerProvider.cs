namespace Server.Providers;

using Server.Domain.Models;
using Server.Models;

public interface ICustomerProvider
{
    Task<CustomerSummary> GetCustomerSummary(string userId, CancellationToken cancellationToken);
    Task<CustomerBook?> GetCustomerBook(string customerBookId, CancellationToken cancellationToken);
}
