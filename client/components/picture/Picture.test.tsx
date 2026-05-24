import { render, screen } from "@testing-library/react";
import { Picture } from "./Picture";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

jest.mock("@jecfe/react-design-system", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

describe("Picture", () => {
  it("shows a spinner when loading", () => {
    render(<Picture title="My Book" loading />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders an image when pictureUrl is provided and not loading", () => {
    render(
      <Picture title="My Book" pictureUrl="https://example.com/cover.jpg" />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "My Book");
    expect(img).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  it("renders a placeholder when no pictureUrl and not loading", () => {
    render(<Picture title="My Book" />);
    expect(screen.getByText("Book cover unavailable")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("does not show the spinner when loading is false", () => {
    render(
      <Picture title="My Book" loading={false} pictureUrl="https://example.com/cover.jpg" />,
    );
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });
});
