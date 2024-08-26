namespace Server.Domain.Exceptions;

public class BookNotFoundException(string isbn)
    : Exception($"Book for {isbn} can not be found.") { }
