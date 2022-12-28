import * as React from "react";
import { storiesOf } from "@storybook/react";
import { select } from "@storybook/addon-knobs/react";

import { Button } from "../../buttons/button/Button";
import { Tooltip } from "./Tooltip";

storiesOf("Tooltip", module).add("Basic", () => {
  const colorScheme = select("Colour Scheme", ["dark", "light"], "dark");
  return (
    <Tooltip
      content={"Tooltip content"}
      position={"top"}
      colorScheme={colorScheme}
    >
      <Button buttonType="secondary">Hover Trigger</Button>
    </Tooltip>
  );
});
