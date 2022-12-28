import * as React from "react";
import { mount } from "enzyme";

import { ActionBarSearchItem } from "./ActionBarSearchItem";

describe("ActionBarSearchItem", () => {
  const searchButton = 'button[data-sk-name="action-bar-search-button"]';
  const searchInput = 'input[data-sk-name="action-bar-search-input"]';
  const clearInputButton =
    'button[data-sk-name="action-bar-search-clear-button"]';

  it("opens input on search icon click", () => {
    const wrapper = mount(<ActionBarSearchItem />);

    expect(wrapper.find(searchButton).length).toEqual(1);
    expect(wrapper.find(searchInput).length).toEqual(0);
    expect(wrapper.find(clearInputButton).length).toEqual(0);

    wrapper.find(searchButton).simulate("click");
    expect(wrapper.find(searchInput).length).toEqual(1);
    expect(wrapper.find(clearInputButton).length).toEqual(0);
  });

  it("displays clear input button when input not empty", () => {
    const wrapper = mount(<ActionBarSearchItem />);

    wrapper.find(searchButton).simulate("click");
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("");

    wrapper.find(searchInput).simulate("change", { target: { value: "test" } });
    expect(wrapper.find(clearInputButton).length).toEqual(1);
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("test");

    wrapper.find(searchInput).simulate("change", { target: { value: "" } });
    expect(wrapper.find(clearInputButton).length).toEqual(0);
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("");
  });

  it("closes search input with clear input button click", () => {
    const wrapper = mount(<ActionBarSearchItem />);

    wrapper.find(searchButton).simulate("click");
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("");

    wrapper.find(searchInput).simulate("change", { target: { value: "test" } });
    expect(wrapper.find(clearInputButton).length).toEqual(1);
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("test");

    wrapper.find(clearInputButton).simulate("click");
    expect(wrapper.find(clearInputButton).length).toEqual(0);
    expect(wrapper.find(searchInput).length).toEqual(0);
  });

  it("closes search input when input empty and clicked outside component", () => {
    const wrapper = mount(<ActionBarSearchItem />);

    wrapper.find(searchButton).simulate("click");
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("");

    wrapper.find(searchInput).simulate("blur");
    expect(wrapper.find(searchInput).length).toEqual(0);
  });

  it("keeps search input open when input not empty and clicked outside component", () => {
    const wrapper = mount(<ActionBarSearchItem />);

    wrapper.find(searchButton).simulate("click");
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("");

    wrapper.find(searchInput).simulate("change", { target: { value: "test" } });
    expect(wrapper.find(clearInputButton).length).toEqual(1);
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("test");

    wrapper.find(searchInput).simulate("blur");
    expect(wrapper.find(searchInput).length).toEqual(1);
  });

  it("updates input value when typing", () => {
    const wrapper = mount(<ActionBarSearchItem />);

    wrapper.find(searchButton).simulate("click");
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("");

    wrapper.find(searchInput).simulate("change", { target: { value: "test" } });
    expect(wrapper.find(clearInputButton).length).toEqual(1);
    expect(wrapper.find(searchInput).get(0).props.value).toEqual("test");

    wrapper
      .find(searchInput)
      .simulate("change", { target: { value: "another test" } });
    expect(wrapper.find(clearInputButton).length).toEqual(1);
    expect(wrapper.find(searchInput).get(0).props.value).toEqual(
      "another test"
    );

    wrapper
      .find(searchInput)
      .simulate("change", { target: { value: "yet another test" } });
    expect(wrapper.find(clearInputButton).length).toEqual(1);
    expect(wrapper.find(searchInput).get(0).props.value).toEqual(
      "yet another test"
    );
  });
});
