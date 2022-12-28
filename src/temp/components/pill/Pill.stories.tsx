import * as React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean, select } from "@storybook/addon-knobs/react";
import { action } from "@storybook/addon-actions";

import icons from "../icon/iconPaths";
import { IconNames } from "../icon/Icon";
import { Pill } from "./Pill";

const iconNames = Object.keys(icons) as IconNames[];

storiesOf("Pill", module).add("Pill", () => {
  const onClose = boolean("close", false);
  const showIcon = boolean("showIcon", false);
  return (
    <Pill
      text={text("Text", "I ellipse. Test me out, go on, see if it works")}
      iconName={
        showIcon ? select("Icon name", iconNames, iconNames[0]) : undefined
      }
      onClose={onClose ? action() : undefined}
      tooltipPosition="top"
    />
  );
});
