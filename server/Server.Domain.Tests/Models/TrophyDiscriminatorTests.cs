namespace Server.Domain.Tests;

using Server.Domain.Models;
using Server.Domain.Tests.Fixtures;

public class TrophyDiscriminatorTests(DbFixture fixture) : IClassFixture<DbFixture>
{
    [Theory]
    [MemberData(nameof(TrophyInstances))]
    public async Task Can_persist_and_read_back_trophy_type(Trophy trophy)
    {
        using var context = fixture.CreateContext();
        var customerId = Guid.NewGuid().ToString();
        context.Customers.Add(new() { Id = customerId, CreationDate = DateTimeOffset.UtcNow });
        context.Trophies.Add(trophy);
        await context.SaveChangesAsync();

        using var context2 = fixture.CreateContext();
        var persisted = context2.Trophies.Find(trophy.Id);
        Assert.NotNull(persisted);
        Assert.IsType(trophy.GetType(), persisted);
    }

    public static TheoryData<Trophy> TrophyInstances =>
        new()
        {
            new BetaTester(true) { DateJoined = DateTimeOffset.UtcNow },
            new Contributor { PRContributed = "https://github.com/example/pr/1" },
            new BookAddict(1000) { },
            new Sponsor(),
            new SharingIsCaring(1000) { },
            new AvidReviewer(100) { },
            new Commentator(100) { },
            new GoalScored(10) { },
            new GoalSetter(10) { },
            new Alerter(10) { },
        };
}
