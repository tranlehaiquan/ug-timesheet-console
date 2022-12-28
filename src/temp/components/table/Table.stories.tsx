import * as React from "react";
import { storiesOf } from "@storybook/react";

import { Table, TableHead, TableCell, TableRow, TableBody } from "./Table";
import { number } from "@storybook/addon-knobs";

storiesOf("Table", module)
  .add("Example", () => (
    <Table>
      <TableHead
        cells={[
          {
            name: "Resource Resource Resource Resource Resource Resource Resource Resource ",
            width: number("width", 200),
            resizable: true,
          },
          { name: "Tags", resizable: true },
          { name: "Region" },
        ]}
      />
      <TableBody>
        <TableRow>
          <TableCell>Elliot Alderson</TableCell>
          <TableCell>
            Hacking, IT Security, Irony, A bit ... disrupted
          </TableCell>
          <TableCell>New York City</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Darlene Alderson</TableCell>
          <TableCell>Hacking, Connections</TableCell>
          <TableCell>New York City</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ))
  .add("TableHead", () => (
    <TableHead
      cells={[
        { name: "Resource", width: 300 },
        { name: "Tags" },
        { name: "Region" },
      ]}
    />
  ))
  .add("TableBody", () => (
    <TableBody>
      <TableRow>
        <TableCell>Cell One</TableCell>
        <TableCell>Cell two</TableCell>
      </TableRow>
    </TableBody>
  ))
  .add("TableRow", () => (
    <TableRow>
      <TableCell>Cell One</TableCell>
      <TableCell>Cell two</TableCell>
    </TableRow>
  ))
  .add("TableCell", () => <TableCell>Cell content</TableCell>);
