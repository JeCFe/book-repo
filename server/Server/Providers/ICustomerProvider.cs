namespace Server.Providers;

using Microsoft.Extensions.Options;
using Server.Models;

public interface ICustomerProvider
{
    Task<CustomerSummary> GetCustomerSummary(string userId, CancellationToken cancellationToken);
    Task<ResponseCustomerBook?> GetCustomerBook(
        Guid customerBookId,
        string customerId,
        CancellationToken cancellationToken
    );
    Task<List<ResponseCustomerBook>> GetCustomerBooks(
        string customerId,
        CancellationToken cancellationToken
    );
}
