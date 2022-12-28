import * as React from "react";
import { render, shallow } from "enzyme";

import { InlineTabs, IState, getInitialSubmenuItem } from "./InlineTabs";

const submenu = [
  { name: "Sub one", id: "sub-one" },
  { name: "Sub two", id: "sub-two" },
];
const tabs = [
  { name: "Tab one", id: "tab-one" },
  { name: "Tab two", id: "tab-two" },
  { name: "Tab three", id: "tab-three" },
  { name: "Tab four", id: "tab-four" },
];

describe("InlineTabs", () => {
  test("it renders correctly", () => {
    // Arrange
    const component = render(<InlineTabs tabs={tabs} onTabClick={jest.fn()} />);

    // Assert
    expect(component).toMatchSnapshot();
  });

  test("renders with correct initial state", () => {
    // Arrange
    const component = shallow<{}, IState>(
      <InlineTabs tabs={tabs} onTabClick={jest.fn()} />
    );

    // Assert
    expect(component.state().activeTab).toBe(tabs[0].id);
  });

  test("renders with correct state when passed a initialActiveTab", () => {
    // Arrange
    const component = shallow<{}, IState>(
      <InlineTabs
        tabs={tabs}
        initialActiveTab={tabs[2]}
        onTabClick={jest.fn()}
      />
    );

    // Assert
    expect(component.state().activeTab).toBe(tabs[2].id);
  });

  test("clicking a new tab sets the correct state", () => {
    // Arrange
    const onTabClickSpy = jest.fn();
    const component = shallow<{}, IState>(
      <InlineTabs tabs={tabs} onTabClick={onTabClickSpy} />
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
    const tabClickPayload = {
      tabClickedId: "tab-three",
      submenuClickedId: null,
    };
    expect(onTabClickSpy).toBeCalledWith(tabClickPayload);
  });

  describe("getInitialSubmenuItem", () => {
    test("no initialActiveTab passed", () => {
      // Arrange/Act
      const value = getInitialSubmenuItem({
        tabs,
        initialActiveTab: null,
        initialActiveSubmenuItem: null,
      });

      // Assert
      expect(value).toBeNull;
    });

    test("initialActiveTab passed through", () => {
      // Arrange
      const initialActiveTab = { ...tabs[2], submenu };

      // Act
      const value = getInitialSubmenuItem({
        tabs,
        initialActiveTab,
        initialActiveSubmenuItem: null,
      });

      // Assert
      expect(value).toBe(submenu[0].id);
    });

    test("initialActiveSubmenuItem passed through with NO initialActiveTab", () => {
      // Arrange/Act
      const value = getInitialSubmenuItem({
        tabs,
        initialActiveTab: null,
        initialActiveSubmenuItem: submenu[1].id,
      });

      // Assert
      expect(value).toBeNull;
    });

    test("initialActiveSubmenuItem passed through with initialActiveTab", () => {
      // Arrange
      const initialActiveTab = { ...tabs[2], submenu };

      // Act
      const value = getInitialSubmenuItem({
        tabs,
        initialActiveTab,
        initialActiveSubmenuItem: submenu[1].id,
      });

      // Assert
      expect(value).toBe(submenu[1].id);
    });
  });
});
