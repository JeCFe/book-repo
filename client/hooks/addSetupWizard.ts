import { useSessionStorage } from "usehooks-ts";

export const SESSION_STORAGE_KEY = "setup-account";

export type Config = "express" | "advanced";
export type SetupBookshelf = string[];
export type IncludeDefaultShelves = boolean;
export type SetupBook = {
  isbn: string;
  name: string;
  release: string;
  picture: string;
  pageCount?: number;
  authors?: string[];
  subjects?: string[];
};
export type Nickname = string;
type Action =
  | { type: "set-nickanme"; nickname: Nickname }
  | {
      type: "set-config-option";
      option: Config;
    }
  | {
      type: "add-bookshelves";
      bookshelves?: SetupBookshelf;
      defaults: IncludeDefaultShelves;
    }
  | {
      type: "add-books";
      setupBooks: SetupBook[];
    };

export type NewCustomer = {
  nickname?: Nickname;
  config?: Config;
  bookshelves?: SetupBookshelf;
  books?: SetupBook[];
  includeDefaults: IncludeDefaultShelves;
};

export const getDefaultState = (): NewCustomer => ({
  nickname: undefined,
  config: undefined,
  bookshelves: undefined,
  books: undefined,
  includeDefaults: false,
});

export const reducer = ({
  state = getDefaultState(),
  action,
}: {
  state: NewCustomer;
  action: Action;
}): NewCustomer => {
  switch (action.type) {
    case "set-nickanme": {
      return { ...state, nickname: action.nickname };
    }
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
        includeDefaults: action.defaults,
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
      (newSetupCustomerData.nickname !== undefined &&
        newSetupCustomerData.config === "advanced" &&
        newSetupCustomerData.books !== undefined &&
        newSetupCustomerData.bookshelves !== undefined) ||
      (newSetupCustomerData.nickname !== undefined &&
        newSetupCustomerData.config === "express")
    ) {
      return true;
    }

    return false;
  };

  const completeNewRegistration = complete();
  const isComplete = completeNewRegistration != null;

  return {
    nickname: newSetupCustomerData.nickname,
    config: newSetupCustomerData.config,
    books: newSetupCustomerData.books,
    bookshelves: newSetupCustomerData.bookshelves,
    includeDefaults: newSetupCustomerData.includeDefaults,
    updateCustomer,
    isComplete,

    completeNewRegistration,
  } as const;
};
