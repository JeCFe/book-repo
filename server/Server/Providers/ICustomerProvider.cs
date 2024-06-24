namespace Server.Providers;

using Server.Models;

public interface ICustomerProvider
{
    Task<CustomerSummary> GetCustomerSummary(string userId, CancellationToken cancellationToken);
    Task<CustomerBook?> GetCustomerBook(Guid customerBookId, CancellationToken cancellationToken);
}
