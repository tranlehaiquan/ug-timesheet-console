import * as React from "react";
import { mount, shallow } from "enzyme";
import { DropdownList } from "./DropdownList";

describe("Dropdown List", () => {
  it("shows badges in array list", () => {
    const wrapper = mount(
      <DropdownList
        options={["option 1", "option 2"]}
        selectedCount={{ "option 1": 5 }}
        onOptionClick={() => () => {}}
      />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-default"]')).toHaveLength(1);
    expect(wrapper.find('[data-sk-name="sk-badge-default"]').text()).toEqual(
      "5"
    );
  });
});
