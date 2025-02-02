"use client";
import { useSessionStorage } from "usehooks-ts";

export const SESSION_STORAGE_KEY = "setup-account";

export type Config = "express" | "advanced";
export type SetupBookshelf = string[];
export type IncludeDefaultShelves = boolean;
export type SetupBook = {
  isbn: string;
  name: string;
};
export type Nickname = string;
type Action =
  | { type: "set-nickanme"; nickname: Nickname }
  | {
      type: "set-config-option";
      option: Config;
    };

export type NewCustomer = {
  nickname?: Nickname;
  config?: Config;
  includeDefaults: IncludeDefaultShelves;
};

export const getDefaultState = (): NewCustomer => ({
  nickname: undefined,
  config: undefined,
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
          includeDefaults: true,
        };
      }
      return {
        ...state,
        config: action.option,
      };
    }
  }
};

export const useSetupWizard = () => {
  const [newSetupCustomerData, setNewSetupCustomerData] =
    useSessionStorage<NewCustomer>(SESSION_STORAGE_KEY, getDefaultState());

  const updateCustomer = (action: Action) => {
    const newState = reducer({ state: { ...newSetupCustomerData }, action });
    setNewSetupCustomerData(newState);
    return newState;
  };

  const complete = (customer: NewCustomer) => {
    if (customer.nickname !== undefined && customer.config === "express") {
      return true;
    }

    return false;
  };

  const completeNewRegistration = complete(newSetupCustomerData);
  const isComplete = completeNewRegistration != null;

  return {
    nickname: newSetupCustomerData.nickname,
    config: newSetupCustomerData.config,
    includeDefaults: newSetupCustomerData.includeDefaults,
    updateCustomer,
    complete,
    isComplete,
    completeNewRegistration,
  } as const;
};
