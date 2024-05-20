import { useSessionStorage } from "usehooks-ts";

export const SESSION_STORAGE_KEY = "setup-account";

export type Config = "express" | "advanced";
export type SetupBookshelf = { names: string[]; includeDefaults: boolean };
export type IncludeDefaultShelves = boolean;
export type SetupBook = {
  bookshelfName: string;
  name: string;
  picture: string;
  author: string;
  release: string;
};
type Action =
  | {
      type: "set-config-option";
      option: Config;
    }
  | {
      type: "add-bookshelves";
      bookshelves?: SetupBookshelf;
    }
  | {
      type: "add-books";
      setupBooks: SetupBook[];
    };

export type NewCustomer = {
  config?: Config;
  bookshelves?: SetupBookshelf;
  books?: SetupBook[];
};

export const getDefaultState = (): NewCustomer => ({
  config: undefined,
  bookshelves: undefined,
  books: undefined,
});

export const reducer = ({
  state = getDefaultState(),
  action,
}: {
  state: NewCustomer;
  action: Action;
}): NewCustomer => {
  switch (action.type) {
    case "set-config-option": {
      if (action.option == "express") {
        return {
          ...getDefaultState(),
          config: action.option,
        };
      }
      return {
        ...state,
        config: action.option,
      };
    }
    case "add-bookshelves": {
      return {
        ...state,
        bookshelves: action.bookshelves,
      };
    }
    case "add-books": {
      return {
        ...state,
        books: action.setupBooks,
      };
    }
  }
};

export const useSetupWizard = () => {
  const [newSetupCustomerData, setNewSetupCustomerData] =
    useSessionStorage<NewCustomer>(SESSION_STORAGE_KEY, getDefaultState());

  const updateCustomer = (action: Action) => {
    setNewSetupCustomerData(
      reducer({ state: { ...newSetupCustomerData }, action }),
    );
  };

  const complete = () => {
    if (
      (newSetupCustomerData.config === "advanced" &&
        newSetupCustomerData.books !== undefined &&
        newSetupCustomerData.bookshelves !== undefined) ||
      newSetupCustomerData.config === "express"
    ) {
      return true;
    }

    return false;
  };

  const completeNewRegistration = complete();
  const isComplete = completeNewRegistration != null;

  return {
    config: newSetupCustomerData.config,
    books: newSetupCustomerData.books,
    bookshelves: newSetupCustomerData.bookshelves,
    updateCustomer,
    isComplete,
    completeNewRegistration,
  } as const;
};
