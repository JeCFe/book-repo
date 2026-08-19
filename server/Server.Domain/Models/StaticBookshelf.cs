using Faker;

namespace Server.Domain.Models;

public static class StaticBookshelf
{
    public static Bookshelf Homeless() =>
        new()
        {
            Name = "Homeless Books",
            Id = Guid.NewGuid(),
            HomelessBooks = true,
        };

    public static Bookshelf CurrentlyRead() =>
        new() { Name = "Currently Reading", Id = Guid.NewGuid() };

    public static Bookshelf WantingToRead() =>
        new() { Name = "Wanting to read", Id = Guid.NewGuid() };

    public static Bookshelf Read() => new() { Name = "Read", Id = Guid.NewGuid() };
}
