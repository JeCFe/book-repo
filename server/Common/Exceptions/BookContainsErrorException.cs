namespace Common.Exceptions;

using Server.Domain.Scalars;

public class BookContainsErrorException(string isbn, BookErrorType type)
    : Exception($"Book for {isbn} already contains error for type {type}") { }
