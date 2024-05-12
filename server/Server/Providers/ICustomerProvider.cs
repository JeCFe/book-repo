namespace Server.Providers;

using Server.Models;

public interface ICustomerProvider
{
    Task<CustomerSummary> GetCustomerSummary(CancellationToken cancellationToken);
}
