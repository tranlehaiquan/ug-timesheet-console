import * as React from "react";
import { mount } from "enzyme";
import { range } from "lodash";

import { Button } from "../buttons/button/Button";
import {
  ActionBar,
  ActionBarActions,
  ActionBarViewControls,
  IActionBar,
} from "./ActionBar";

const getDefaultTestProps = (): IActionBar => {
  return {
    countValue: 200,
    countName: "test",
  };
};

describe("ActionBar", () => {
  const container = '[data-sk-name="action-bar-container"]';
  const details = '[data-sk-name="action-bar-details"]';
  const items = '[data-sk-name="action-bar-items"]';
  const actions = '[data-sk-name="action-bar-actions"]';
  const viewControls = '[data-sk-name="action-bar-view-controls"]';
  const searchButton = 'button[data-sk-name="action-bar-search-button"]';

  it("renders action bar", () => {
    const wrapper = mount(<ActionBar {...getDefaultTestProps()} />);
    expect(wrapper.find(container).length).toEqual(1);
    expect(wrapper.find(details).length).toEqual(1);
    expect(wrapper.find(ActionBar).text()).toEqual("200 test");
  });

  it("renders action bar with content", () => {
    const itemsCount = 2;
    const wrapper = mount(
      <ActionBar {...getDefaultTestProps()}>
        <ActionBarActions>
          {range(itemsCount).map((index) => (
            <div key={index}>action{index + 1}</div>
          ))}
        </ActionBarActions>
        <ActionBarViewControls withSearch={false}>
          {range(itemsCount).map((index) => (
            <div key={index}>control{index + 1}</div>
          ))}
        </ActionBarViewControls>
      </ActionBar>
    );

    expect(wrapper.find(container).length).toEqual(1);
    expect(wrapper.find(details).length).toEqual(1);
    expect(wrapper.find(items).length).toEqual(1);
    expect(wrapper.find(items).children().length).toEqual(2);
    expect(wrapper.find(actions).children().length).toEqual(itemsCount);
    expect(wrapper.find(viewControls).children().length).toEqual(itemsCount);
  });

  it("renders action bar with actions items", () => {
    const itemsCount = 2;
    const wrapper = mount(
      <ActionBar {...getDefaultTestProps()}>
        <ActionBarActions>
          {range(itemsCount).map((index) => (
            <div key={index}>action{index + 1}</div>
          ))}
        </ActionBarActions>
      </ActionBar>
    );

    expect(wrapper.find(actions).length).toEqual(1);
    expect(wrapper.find(actions).children().length).toEqual(itemsCount);
  });

  it("renders action bar with view controls items", () => {
    const itemsCount = 2;
    const wrapper = mount(
      <ActionBar {...getDefaultTestProps()}>
        <ActionBarViewControls withSearch={false}>
          {range(itemsCount).map((index) => (
            <div key={index}>control{index + 1}</div>
          ))}
        </ActionBarViewControls>
      </ActionBar>
    );

    expect(wrapper.find(viewControls).length).toEqual(1);
    expect(wrapper.find(viewControls).children().length).toEqual(itemsCount);
  });

  it("renders action bar with view controls items with search", () => {
    const itemsCount = 2;
    const wrapper = mount(
      <ActionBar {...getDefaultTestProps()}>
        <ActionBarViewControls withSearch={true}>
          {range(itemsCount).map((index) => (
            <div key={index}>control{index + 1}</div>
          ))}
        </ActionBarViewControls>
      </ActionBar>
    );

    expect(wrapper.find(viewControls).length).toEqual(1);
    expect(wrapper.find(viewControls).children().length).toEqual(
      itemsCount + 1
    );
  });

  it("renders action bar with actions", () => {
    const itemsCount = 2;
    const wrapper = mount(
      <ActionBarActions>
        {range(itemsCount).map((index) => (
          <div key={index}>action{index + 1}</div>
        ))}
      </ActionBarActions>
    );

    expect(wrapper.find(actions).length).toEqual(1);
    expect(wrapper.find(actions).children().length).toEqual(itemsCount);
  });

  it("renders action bar view controls without search", () => {
    const wrapper = mount(<ActionBarViewControls withSearch={false} />);

    expect(wrapper.find(viewControls).length).toEqual(1);
    expect(wrapper.find(searchButton).length).toEqual(0);
  });

  it("renders action bar view controls with search", () => {
    const wrapper = mount(<ActionBarViewControls withSearch={true} />);

    expect(wrapper.find(viewControls).length).toEqual(1);
    expect(wrapper.find(searchButton).length).toEqual(1);
  });
});
