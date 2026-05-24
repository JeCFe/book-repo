import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

jest.mock("@jecfe/react-design-system", () => ({
  Anchor: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  Button: ({
    children,
    onClick,
    disabled,
    isLoading,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {isLoading ? "Loading..." : children}
    </button>
  ),
}));

describe("Modal", () => {
  it("renders nothing when isOpen is false", () => {
    render(
      <Modal isOpen={false} actioning={false} disabled={false}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when isOpen is true", () => {
    render(
      <Modal isOpen={true} actioning={false} disabled={false}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("shows Close when no onConfirm is provided", () => {
    render(
      <Modal isOpen={true} actioning={false} disabled={false}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("shows Cancel and Confirm when onConfirm is provided", () => {
    render(
      <Modal
        isOpen={true}
        actioning={false}
        disabled={false}
        onConfirm={jest.fn()}
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("uses a custom confirmText", () => {
    render(
      <Modal
        isOpen={true}
        actioning={false}
        disabled={false}
        onConfirm={jest.fn()}
        confirmText="Save"
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls onClose when close/cancel is clicked", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} actioning={false} disabled={false} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    const onConfirm = jest.fn();
    render(
      <Modal
        isOpen={true}
        actioning={false}
        disabled={false}
        onConfirm={onConfirm}
      >
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("renders an error message when provided", () => {
    render(
      <Modal
        isOpen={true}
        actioning={false}
        disabled={false}
        error="Something went wrong"
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
