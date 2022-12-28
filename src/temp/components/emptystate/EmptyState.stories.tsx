import * as React from "react";
import { storiesOf } from "@storybook/react";
const image = require("../../../assets/tags-placeholder.svg");

import { Button } from "../buttons/button/Button";
import { EmptyState } from "./EmptyState";

storiesOf("Placeholders", module)
  .add("EmptyState", () => (
    <EmptyState
      imgSrc={image}
      title="No tags added yet"
      message="Add tags to filter your resources by"
    />
  ))
  .add("EmptyState with button", () => (
    <EmptyState
      imgSrc={image}
      title="No tags added yet"
      message="Add tags to filter your resources by"
    >
      <Button buttonType="primary">Add tags now</Button>
    </EmptyState>
  ));
