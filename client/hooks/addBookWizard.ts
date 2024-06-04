"use client";
import { useSessionStorage } from "usehooks-ts";

export const SESSION_STORAGE_KEY = "add-book";

export type SetupBook = {
  isbn: string;
  name: string;
  author?: string;
};
export type Nickname = string;
type Action =
  | {
      type: "add-books";
      setupBooks: SetupBook[];
    }
  | { type: "default" };

export type AddBookProcess = {
  books?: SetupBook[];
};

export const getDefaultState = (): AddBookProcess => ({
  books: undefined,
});

export const reducer = ({
  state = getDefaultState(),
  action,
}: {
  state: AddBookProcess;
  action: Action;
}): AddBookProcess => {
  switch (action.type) {
    case "add-books": {
      return {
        ...state,
        books: action.setupBooks,
      };
    }
    case "default": {
      return { books: undefined };
    }
  }
};

export const useSetupWizard = () => {
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
