namespace Common.Exceptions;

using Common.Scalars.Types;

public class BookContainsErrorException(string isbn, BookErrorType type)
    : Exception($"Book for {isbn} already contains error for type {type}") { }
