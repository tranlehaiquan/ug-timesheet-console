import * as React from "react";
import { render, shallow, mount } from "enzyme";

import { ButtonDropdown } from "../ButtonDropdown";

describe("ButtonDropdown", () => {
  test("it renders correctly", () => {
    // Arrange
    const component = render(<ButtonDropdown label="Button dropdown" />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("it renders with compact prop", () => {
    // Arrange
    const component = render(
      <ButtonDropdown label="Button dropdown" compact />
    );

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("renders with correct initial state", () => {
    // Arrange
    const component = shallow<ButtonDropdown>(
      <ButtonDropdown label="Button dropwdown" />
    );

    // Assert
    expect(component.state().activeDropdown).toBe(false);
  });

  test("display dropdown when button clicked", () => {
    // Arrange
    const component = mount<ButtonDropdown>(
      <ButtonDropdown label="Button dropdown">
        <div data-sk-name="child-dropdown-item">child dropdown menu</div>
      </ButtonDropdown>
    );

    // Act
    expect(component.find('[data-sk-name="child-dropdown-item"]')).toHaveLength(
      0
    );
    component.find("button").simulate("click");
    expect(component.find('[data-sk-name="child-dropdown-item"]')).toHaveLength(
      1
    );
  });
});
