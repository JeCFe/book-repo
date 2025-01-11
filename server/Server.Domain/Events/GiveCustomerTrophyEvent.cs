using MediatR;
using Server.Domain.Models;

namespace Server.Domain.Events;

public record GiveCustomerTrophyEvent(string CustomerId, Trophy Trophy) : INotification;
