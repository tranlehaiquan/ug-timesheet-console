import * as React from "react";
import { shallow } from "enzyme";

import { InlineBanner } from "./InlineBanner";

describe("InlineBanner", () => {
  test("success", () => {
    const component = shallow(
      <InlineBanner type="success">Inline banner</InlineBanner>
    );

    expect(component).toMatchSnapshot();
  });

  test("general", () => {
    const component = shallow(
      <InlineBanner type="general">Inline banner</InlineBanner>
    );

    expect(component).toMatchSnapshot();
  });

  test("warning", () => {
    const component = shallow(
      <InlineBanner type="warning">Inline banner</InlineBanner>
    );

    expect(component).toMatchSnapshot();
  });

  test("error", () => {
    const component = shallow(
      <InlineBanner type="error">Inline banner</InlineBanner>
    );

    expect(component).toMatchSnapshot();
  });
});
