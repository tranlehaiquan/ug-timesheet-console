import * as React from "react";
import { render } from "enzyme";

import { Loading } from "../Loading";

describe("Loading", () => {
  test("center", () => {
    // Arrange
    const component = render(<Loading />);

    // Assert
    expect(component).toMatchSnapshot();
    expect(component.prop("class")).toContain("sk-text-center");
  });

  test("left", () => {
    // Arrange
    const component = render(<Loading align="left" />);

    // Assert
    expect(component).toMatchSnapshot();
    expect(component.prop("class")).toContain("sk-text-left");
  });

  test("right", () => {
    // Arrange
    const component = render(<Loading align="right" />);

    // Assert
    expect(component).toMatchSnapshot();
    expect(component.prop("class")).toContain("sk-text-right");
  });
});
