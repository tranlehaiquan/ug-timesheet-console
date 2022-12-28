import * as React from "react";
import { mount } from "enzyme";

import { FilterPill } from "./FilterPill";

const getWrapper = (props = {}) => mount(<FilterPill {...props} />);
const attrName = (name, prefix = "") => `${prefix}[data-sk-name="${name}"]`;

const TEST_NAME = "testName";
const OPTIONS = ["Option", "Option 2", "Option 3"];

describe("Filter Pill", () => {
  it("renders  pill", () => {
    const wrapper = getWrapper();
    const pill = wrapper.find(attrName("sk-added-filter"));
    const findButton = () =>
      wrapper.find(attrName("sk-remove-filter", "button"));
    const onRemove = jest.fn();
    const onClick = jest.fn();

    expect(pill).toHaveLength(1);
    expect(pill.text()).toEqual("");

    wrapper.setProps({ name: TEST_NAME });
    expect(pill.text()).toEqual(`${TEST_NAME}:`);

    wrapper.setProps({ fixed: true });
    expect(pill.text()).toEqual(`${TEST_NAME}:`);

    wrapper.setProps({ selected: [OPTIONS[0]] });
    expect(pill.text()).toEqual(`${TEST_NAME}:${[OPTIONS[0]]}`);

    wrapper.setProps({ name: "" });
    expect(pill.text()).toEqual(`${[OPTIONS[0]]}`);

    wrapper.setProps({ selected: [OPTIONS[0], OPTIONS[1]] });
    expect(pill.text()).toEqual(`${[OPTIONS[0]]}, ${[OPTIONS[1]]}`);

    wrapper.setProps({ selected: OPTIONS });
    expect(pill.text()).toEqual(`${OPTIONS.length} selected`);

    wrapper.setProps({ onRemove });
    expect(findButton()).toHaveLength(0);

    wrapper.setProps({ fixed: false });
    expect(findButton()).toHaveLength(1);
    findButton().simulate("click");
    expect(onRemove).toBeCalledTimes(1);

    wrapper.setProps({ onClick });
    wrapper.find(attrName("sk-sk-added-filter-handler")).simulate("click");
    expect(onClick).toBeCalledTimes(1);
  });
});
