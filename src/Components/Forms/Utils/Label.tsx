import * as React from "react";
import { FormLabel } from "skedulo-ui";

export const Label = ({ text }: { text: string }) => (
  <FormLabel className="sk-block sk-mb-2">{text}</FormLabel>
);
