import * as React from "react";
import { storiesOf } from "@storybook/react";
import { select, text } from "@storybook/addon-knobs/react";

import { InlineBanner } from "./InlineBanner";

storiesOf("InlineBanner", module).add("InlineBanner", () => {
  return (
    <div className="sk-w-1/2">
      <InlineBanner
        type={select(
          "Banner type",
          ["success", "error", "general", "warning"],
          "general"
        )}
      >
        {text("Custom text", "Inline banner message")}
      </InlineBanner>
    </div>
  );
});
