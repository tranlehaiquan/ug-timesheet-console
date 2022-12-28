import * as React from "react";
import { shallow } from "enzyme";

import { ReadOnly } from "../ReadOnly";
import { Icon } from "../../icon/Icon";

describe("ReadOnly", () => {
  test("renders correctly", () => {
    // Arrange
    const component = shallow(
      <ReadOnly value="Hello world" name="hello-world" />
    );

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("renders the correct icon on hover", () => {
    // Arrange
    const component = shallow(
      <ReadOnly value="Hello world" name="hello-world" />
    );
    const lockedComponent = shallow(
      <ReadOnly value="Hello world" name="hello-world" locked />
    );

    // Act
    component.simulate("mouseover");

    // Assert
    // Edit
    expect(component.find(Icon).length).toBe(1);
    expect(component.find(Icon).props().name).toBe("edit");

    // Locked
    expect(lockedComponent.find(Icon).length).toBe(1);
    expect(lockedComponent.find(Icon).props().name).toBe("locked");
  });

  test("renders correct default value", () => {
    // Arrange
    const component = shallow(
      <ReadOnly value="" name="hello-world" data-sk-name="sked-readonly" />
    );
    const componentWithPlaceholder = shallow(
      <ReadOnly
        value=""
        placeholderValue="Add something"
        name="hello-world"
        data-sk-name="sked-readonly"
      />
    );
    const componentWithInitialValue = shallow(
      <ReadOnly value="Hello" name="hello-world" data-sk-name="sked-readonly" />
    );

    // Assert
    expect(component.find('[data-sk-name="sked-readonly"]').text()).toBe(
      "None <Icon />"
    );
    expect(
      componentWithPlaceholder.find('[data-sk-name="sked-readonly"]').text()
    ).toBe("Add something <Icon />");
    expect(
      componentWithInitialValue.find('[data-sk-name="sked-readonly"]').text()
    ).toBe("Hello <Icon />");
  });
});
