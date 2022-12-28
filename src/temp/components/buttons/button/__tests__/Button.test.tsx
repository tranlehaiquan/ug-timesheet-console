import * as React from "react";
import { render } from "enzyme";

import { Button } from "../Button";

describe("Buttons", () => {
  test("it renders primary correctly", () => {
    // Arrange
    const component = render(<Button buttonType="primary" />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("it renders secondary correctly", () => {
    // Arrange
    const component = render(<Button buttonType="secondary" />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("it renders transparent correctly", () => {
    // Arrange
    const component = render(<Button buttonType="transparent" />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("it renders primary - compact correctly", () => {
    // Arrange
    const component = render(<Button buttonType="primary" compact />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("it renders primary - disabled correctly", () => {
    // Arrange
    const component = render(<Button buttonType="primary" disabled />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("it renders primary - loading correctly", () => {
    // Arrange
    const component = render(<Button buttonType="primary" loading />);

    // Assert
    expect(component).toMatchSnapshot();
  });
});
