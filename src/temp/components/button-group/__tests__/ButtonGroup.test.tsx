import * as React from "react";
import { render } from "enzyme";

import { Button } from "../../buttons/button/Button";
import { ButtonGroup } from "../ButtonGroup";

describe("ButtonGroup", () => {
  test("it renders correctly", () => {
    const component = render(
      <ButtonGroup>
        <Button buttonType="transparent" />
        <Button buttonType="primary" />
      </ButtonGroup>
    );
    expect(component).toMatchSnapshot();
  });

  test("it renders compact correctly", () => {
    const component = render(
      <ButtonGroup compact>
        <Button buttonType="transparent" />
        <Button buttonType="primary" />
      </ButtonGroup>
    );
    expect(component).toMatchSnapshot();
  });
});
