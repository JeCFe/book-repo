import { act, renderHook } from "@testing-library/react";
import { getDefaultState, reducer, useSetupWizard } from "./addSetupWizard";

describe("addSetupWizard reducer", () => {
  it("returns the default state", () => {
    const state = getDefaultState();
    expect(state.nickname).toBeUndefined();
    expect(state.config).toBeUndefined();
    expect(state.includeDefaults).toBe(false);
  });

  it("set-nickname sets the nickname", () => {
    const state = reducer({
      state: getDefaultState(),
      action: { type: "set-nickname", nickname: "jessica" },
    });
    expect(state.nickname).toBe("jessica");
  });

  it("set-config-option sets config to advanced without changing includeDefaults", () => {
    const state = reducer({
      state: getDefaultState(),
      action: { type: "set-config-option", option: "advanced" },
    });
    expect(state.config).toBe("advanced");
    expect(state.includeDefaults).toBe(false);
  });

  it("set-config-option sets includeDefaults to true when express selected", () => {
    const state = reducer({
      state: { ...getDefaultState(), nickname: "jessica" },
      action: { type: "set-config-option", option: "express" },
    });
    expect(state.config).toBe("express");
    expect(state.includeDefaults).toBe(true);
  });

  it("set-config-option resets other fields when switching to express", () => {
    const state = reducer({
      state: {
        nickname: "jessica",
        config: "advanced",
        includeDefaults: false,
      },
      action: { type: "set-config-option", option: "express" },
    });
    // express resets to default state with config and includeDefaults set
    expect(state.nickname).toBeUndefined();
    expect(state.config).toBe("express");
    expect(state.includeDefaults).toBe(true);
  });
});

describe("useSetupWizard", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("isComplete is false when setup is not finished", () => {
    const { result } = renderHook(() => useSetupWizard());
    expect(result.current.isComplete).toBe(false);
  });

  it("isComplete is true when nickname is set and express config is selected", () => {
    const { result } = renderHook(() => useSetupWizard());

    act(() => {
      result.current.updateCustomer({
        type: "set-nickname",
        nickname: "jessica",
      });
    });
    act(() => {
      result.current.updateCustomer({
        type: "set-config-option",
        option: "express",
      });
    });

    // express resets nickname, so we need to set it after selecting express
    act(() => {
      result.current.updateCustomer({
        type: "set-nickname",
        nickname: "jessica",
      });
    });

    expect(result.current.isComplete).toBe(true);
  });

  it("isComplete is false when only a nickname is set", () => {
    const { result } = renderHook(() => useSetupWizard());

    act(() => {
      result.current.updateCustomer({
        type: "set-nickname",
        nickname: "jessica",
      });
    });

    expect(result.current.isComplete).toBe(false);
  });

  it("isComplete is false when advanced config is selected (requires more steps)", () => {
    const { result } = renderHook(() => useSetupWizard());

    act(() => {
      result.current.updateCustomer({
        type: "set-nickname",
        nickname: "jessica",
      });
    });
    act(() => {
      result.current.updateCustomer({
        type: "set-config-option",
        option: "advanced",
      });
    });

    expect(result.current.isComplete).toBe(false);
  });
});
