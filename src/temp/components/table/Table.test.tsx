import * as React from "react";
import { render, shallow, mount } from "enzyme";
import { merge } from "lodash";

import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TableHeaderCell,
  ITableHeaderCellProps,
  IHeaderCell,
} from "./Table";
import { Condenser } from "../dynamic-table/condenser/Condenser";
import { ColumnResizer } from "../dynamic-table/table-header/ColumnResizer";

describe("Tables", () => {
  describe("Table", () => {
    test("render", () => {
      const Component = render(
        <Table>
          <TableHead
            cells={[
              { name: "Resource", width: 300 },
              { name: "Tags" },
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
      );
      expect(Component).toMatchSnapshot();
    });
  });

  describe("TableHead", () => {
    test("render", () => {
      const Component = render(
        <TableHead
          cells={[
            { name: "Resource", width: 300 },
            { name: "Tags" },
            { name: "Region" },
          ]}
        />
      );
      expect(Component).toMatchSnapshot();
    });

    test("creates correct number of cells", () => {
      const Component = mount(
        <TableHead
          cells={[
            { name: "Resource", width: 300 },
            { name: "Tags" },
            { name: "Region" },
          ]}
        />
      );
      expect(Component.find("th").length).toEqual(3);
    });

    test("applies specified width", () => {
      const Component = mount(
        <TableHead
          cells={[
            { name: "Resource Name", width: 300 },
            { name: "Tags" },
            { name: "Region" },
          ]}
        />
      );
      expect(
        Component.find('[data-sk-name="th-resource-name"]').prop("style").width
      ).toEqual(300);
    });

    test("sets min width", () => {
      const Component = mount(
        <TableHead
          cells={[
            { name: "Resource Name", width: 300 },
            { name: "Tags" },
            { name: "Region" },
          ]}
        />
      );
      expect(
        Component.find('[data-sk-name="th-tags"]').prop("style").minWidth
      ).toEqual("120px");
    });
  });

  describe("TableHeaderCell", () => {
    const sampleProps = {
      cell: {
        name: "test_column",
      },
      index: 1,
    };

    const createProps: (props?: {
      cell?: {};
      index?: number;
    }) => ITableHeaderCellProps = (props) => ({
      ...merge(sampleProps, props),
    });

    test("no resizer by default", () => {
      const component = mount(<TableHeaderCell {...createProps()} />);
      expect(component.find(ColumnResizer).length).toEqual(0);
    });

    test("creates resizer when necessary", () => {
      const props = createProps({
        cell: {
          resizable: true,
        },
      });
      const component = mount(<TableHeaderCell {...props} />);
      expect(component.find(ColumnResizer).length).toEqual(1);
    });

    test("wraps cell name in a condenser", () => {
      const component = mount(<TableHeaderCell {...createProps()} />);
      const condenser = component.find(Condenser);
      expect(condenser.length).toEqual(1);
      expect(condenser.text()).toEqual(sampleProps.cell.name);
    });

    test("keeps th's css position non-static", () => {
      const component = mount(<TableHeaderCell {...createProps()} />);
      const th = component.find("th");
      expect(th.length).toBe(1);
      expect(th.props().style.position).toEqual("sticky");
    });

    test("sets default condenser min width to 120", () => {
      const props = createProps({
        cell: {
          resizable: true,
        },
      });
      const component = mount(<TableHeaderCell {...props} />);
      const resizer = component.find(ColumnResizer);
      expect(resizer.props().min).toEqual(120);
    });

    test("applies minWidth setting to resizer", () => {
      const props = createProps({
        cell: {
          resizable: true,
          minWidth: 200,
        },
      });
      const component = mount(<TableHeaderCell {...props} />);
      const resizer = component.find(ColumnResizer);
      expect(resizer.props().min).toEqual(props.cell.minWidth);
    });
  });

  describe("TableBody", () => {
    test("render", () => {
      const Component = render(
        <TableBody>
          <TableRow>
            <TableCell>Cell content</TableCell>
          </TableRow>
        </TableBody>
      );
      expect(Component).toMatchSnapshot();
    });
  });

  describe("TableRow", () => {
    test("render", () => {
      const Component = render(
        <TableRow>
          <TableCell>Cell content</TableCell>
        </TableRow>
      );
      expect(Component).toMatchSnapshot();
    });
  });

  describe("TableCell", () => {
    test("render", () => {
      const Component = render(<TableCell>Cell content</TableCell>);
      expect(Component).toMatchSnapshot();
    });
  });
});
