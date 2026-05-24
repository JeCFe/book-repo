import { fireEvent, render, screen } from "@testing-library/react";
import { RenderStar } from "./RenderStar";

describe("RenderStar", () => {
  it("renders 5 radio inputs by default", () => {
    render(<RenderStar />);
    const inputs = screen.getAllByRole("radio");
    expect(inputs).toHaveLength(5);
  });

  it("renders a custom number of stars", () => {
    render(<RenderStar amountOfStars={3} />);
    const inputs = screen.getAllByRole("radio");
    expect(inputs).toHaveLength(3);
  });

  it("calls onChange with the correct star value when a radio is changed", () => {
    const onChange = jest.fn();
    render(<RenderStar onChange={onChange} />);
    const inputs = screen.getAllByRole("radio");
    fireEvent.click(inputs[2]); // 3rd star (1-based = 3)
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onChange with the correct value for the first star", () => {
    const onChange = jest.fn();
    render(<RenderStar onChange={onChange} />);
    const inputs = screen.getAllByRole("radio");
    fireEvent.click(inputs[0]);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("calls onChange with the correct value for the last star", () => {
    const onChange = jest.fn();
    render(<RenderStar amountOfStars={5} onChange={onChange} />);
    const inputs = screen.getAllByRole("radio");
    fireEvent.click(inputs[4]);
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
