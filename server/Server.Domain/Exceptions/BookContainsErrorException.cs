using Server.Domain.Scalars;

namespace Server.Domain.Exceptions;

public class BookContainsErrorException(string isbn, BookErrorType type)
    : Exception($"Book for {isbn} already contains error for type {type}") { }
