import * as React from "react";
import { render, shallow } from "enzyme";

import { PillTabs, IPillTabsState } from "./PillTabs";

const tabs = [
  { name: "Tab one", id: "tab-one" },
  { name: "Tab two", id: "tab-two" },
  { name: "Tab three", id: "tab-three" },
  { name: "Tab four", id: "tab-four" },
];

describe("PillTabs", () => {
  test("it renders correctly", () => {
    // Arrange
    const component = render(<PillTabs tabs={tabs} onTabClick={jest.fn()} />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("renders with correct initial state", () => {
    // Arrange
    const component = shallow<{}, IPillTabsState>(
      <PillTabs tabs={tabs} onTabClick={jest.fn()} />
    );

    // Assert
    expect(component.state().activeTab).toBe(tabs[0].id);
  });

  test("renders with correct state when passed a initialActiveTab", () => {
    // Arrange
    const component = shallow<{}, IPillTabsState>(
      <PillTabs tabs={tabs} initialActiveTab={tabs[2]} onTabClick={jest.fn()} />
    );

    // Assert
    expect(component.state().activeTab).toBe(tabs[2].id);
  });

  test("clicking a new tab sets the correct state", () => {
    // Arrange
    const onTabClickSpy = jest.fn();
    const component = shallow<{}, IPillTabsState>(
      <PillTabs tabs={tabs} onTabClick={onTabClickSpy} />
    );

    // Act
    expect(component.state().activeTab).toBe("tab-one");
    const tabThree = component
      .find("li")
      .findWhere((item) => item.text() === "Tab three")
      .first();
    tabThree.simulate("click");

    // Assert
    expect(component.state().activeTab).toBe("tab-three");
    expect(onTabClickSpy).toBeCalled;
    expect(onTabClickSpy).toBeCalledWith("tab-three");
  });
});
