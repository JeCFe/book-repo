"use client";
import { useSessionStorage } from "usehooks-ts";
import { SetupBook } from ".";

const SESSION_STORAGE_KEY = "add-book";

type Action =
  | {
      type: "add-books";
      setupBook: SetupBook;
    }
  | { type: "remove-book"; isbn: string }
  | { type: "default" };

type AddBookProcess = {
  books?: SetupBook[];
};

const getDefaultState = (): AddBookProcess => ({
  books: undefined,
});

const reducer = ({
  state = getDefaultState(),
  action,
}: {
  state: AddBookProcess;
  action: Action;
}): AddBookProcess => {
  switch (action.type) {
    case "add-books": {
      return {
        books: [...(state.books ?? []), action.setupBook],
      };
    }
    case "remove-book": {
      return {
        books: [...(state.books ?? [])].filter(
          (prev) => prev.isbn === action.isbn,
        ),
      };
    }
    case "default": {
      return { books: undefined };
    }
  }
};

export const useBookWizard = () => {
  const [newAddBookData, setnewAddBookData] = useSessionStorage<AddBookProcess>(
    SESSION_STORAGE_KEY,
    getDefaultState(),
  );

  const updateBook = (action: Action) => {
    const newState = reducer({ state: { ...newAddBookData }, action });
    setnewAddBookData(newState);
    return newState;
  };

  return {
    books: newAddBookData.books,
    updateBook,
  } as const;
};
