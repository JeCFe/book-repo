import { render, screen } from "@testing-library/react";
import { ErrorSummary } from "./ErrorSummary";

jest.mock("@jecfe/react-design-system", () => ({
  Info: () => <svg data-testid="info-icon" />,
  ErrorMessage: ({ errors }: { errors: { message: string }[] | undefined }) => (
    <ul>{errors?.map((e, i) => <li key={i}>{e.message}</li>)}</ul>
  ),
}));

describe("ErrorSummary", () => {
  it("renders the Important! heading", () => {
    render(<ErrorSummary errors={undefined} />);
    expect(screen.getByText("Important!")).toBeInTheDocument();
  });

  it("renders the info icon", () => {
    render(<ErrorSummary errors={undefined} />);
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("renders error messages when provided", () => {
    const errors = [
      { message: "Field is required" },
      { message: "Invalid value" },
    ] as any;
    render(<ErrorSummary errors={errors} />);
    expect(screen.getByText("Field is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid value")).toBeInTheDocument();
  });
});
