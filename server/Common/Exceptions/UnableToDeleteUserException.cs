namespace Common.Exceptions;

public class UnableToDeleteUserException : Exception
{
    public UnableToDeleteUserException() { }

    public UnableToDeleteUserException(string message)
        : base(message) { }
}
