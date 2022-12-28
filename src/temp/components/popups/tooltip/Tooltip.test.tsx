import * as React from "react";
import { shallow } from "enzyme";

import { Tooltip, ITooltipProps } from "./Tooltip";

const getDefaultTestProps = (additionalProps = {}): ITooltipProps => {
  return {
    content: "Some tooltip text",
    position: "top",
    ...additionalProps,
  };
};

describe("Tooltip", () => {
  it("renders", () => {
    // Arrange
    const wrapper = shallow(<Tooltip {...getDefaultTestProps()} />);
    // Assert
    expect(wrapper.find("InfoWindow").length).toEqual(1);
  });

  it("renders correct props", () => {
    // Arrange
    const cursorOption = {
      rule: "follow",
      keepOnMouseMove: true,
    };
    const props = {
      cursorOption,
      delayShow: 250,
      preventShow: true,
      className: "tooltip",
      displayInline: true,
    };
    const testProps = getDefaultTestProps(props);
    const wrapper = shallow(<Tooltip {...testProps} />);
    const componentProps = wrapper.find("InfoWindow").props() as ITooltipProps;

    // Assert
    expect(componentProps.content).toEqual(testProps.content);
    expect(componentProps.position).toEqual(testProps.position);

    expect(componentProps.delayShow).toEqual(testProps.delayShow);
    expect(componentProps.preventShow).toEqual(testProps.preventShow);
    expect(componentProps.className).toEqual(testProps.className);
    expect(componentProps.displayInline).toEqual(testProps.displayInline);
    expect(componentProps.cursorOption).toEqual(testProps.cursorOption);
  });
});
