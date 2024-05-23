namespace Server.Exceptions;

public class InvalidUserException : Exception
{
    public InvalidUserException() { }

    public InvalidUserException(string message)
        : base(message) { }
}
