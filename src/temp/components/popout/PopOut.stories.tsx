import * as React from "react";
import { storiesOf } from "@storybook/react";

import { PopOut } from "./PopOut";
import { PopOutBase } from "./PopOutBase";

storiesOf("PopOuts", module)
  .add("PopOutBase", () => (
    <PopOutBase
      placement={"right"}
      trigger={
        <div className="sk-text-lg sk-cursor-pointer sk-p-4 sk-bg-teal-darker sk-text-white">
          This is the trigger {`︻╦╤─`}
        </div>
      }
    >
      <div className="sk-p-4 sk-border sk-border-teal-darker sk-bg-white sk-text-teal-darker">
        BOOM!
      </div>
    </PopOutBase>
  ))
  .add("PopOut", () => (
    <PopOut
      placement={"right"}
      trigger={
        <div className="sk-text-lg sk-cursor-pointer sk-p-4 sk-bg-teal-darker sk-text-white">
          This is the trigger {`︻╦╤─`}
        </div>
      }
    >
      <div className="sk-p-4 sk-border sk-border-teal-darker sk-bg-white sk-text-teal-darker">
        BOOM!
      </div>
    </PopOut>
  ));
