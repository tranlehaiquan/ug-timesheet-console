import * as React from "react";
import { render } from "enzyme";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  test("render", () => {
    const wrapper = render(
      <EmptyState
        imgSrc="test.png"
        title="Empty state title"
        message="Sub title"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
