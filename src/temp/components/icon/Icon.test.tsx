import * as React from "react";
import { Icon } from "./Icon";
import { render, shallow } from "enzyme";

describe("Icon", () => {
  test("renders correctly", () => {
    // Arrange
    const arrowIcon = render(<Icon name="arrowLeft" />);

    // Assert
    expect(arrowIcon).toMatchSnapshot();
  });

  test("renders with additional classes", () => {
    // Arrange
    const jobsIcon = render(<Icon name="jobs" className="extra-class" />);

    // Assert
    expect(jobsIcon).toMatchSnapshot();
  });

  test("changes when you change icon name", () => {
    // Arrange
    const arrowIcon = render(<Icon name="arrowLeft" />);
    const chatIcon = render(<Icon name="chat" />);

    // Assert
    expect(arrowIcon).not.toEqual(chatIcon);
  });

  test("calls onclick prop if supplied", () => {
    const onClickSpy = jest.fn();
    const wrapper = shallow(<Icon name="chat" onClick={onClickSpy} />);
    wrapper.simulate("click");
    expect(onClickSpy).toBeCalled();
  });

  test("it passes through other props", () => {
    const wrapper = shallow(<Icon name="chevronDown" data-sk-name="test" />);
    expect(wrapper.find('[data-sk-name="test"]').length).toBe(1);
  });
});
