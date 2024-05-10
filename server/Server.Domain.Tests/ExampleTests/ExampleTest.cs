namespace Server.Domain.Tests.ExampleTests;

using Server.Domain.Example;

public class ExampleTests
{
    [Fact]
    public void ExampleDomainTest()
    {
        var exampleClass = new ExampleClass();
        var actual = exampleClass.ReturnsTrue();
        Assert.True(actual);
    }
}
