import * as React from "react";
import { shallow, mount } from "enzyme";
import { DynamicTable } from "./DynamicTable";
import { TableConfig } from "./DynamicTable-utils";
import { TableHeaderRenderer } from "./table-header/TableHeaderRenderer";
import { TableBody, TableCell, TableRow } from "../table/Table";

import { Icon } from "../icon/Icon";

import { shuffle } from "lodash";
import { FormInputElement } from "../forms/FormElements";
import { TableRows } from "./table-row/TableRows";
import { TableGroups } from "./table-row/TableGroups";

interface TestData {
  field1: string;
  field2: string;
  field3: string;
}

const getDefaultTestProps = (
  additionalProps = {},
  onSort: (data: any) => void = (data) => {}
) => {
  return {
    data: [
      { field1: "value11", field2: "value12", field3: "value" },
      { field1: "value21", field2: "value22", field3: "value" },
      { field1: "value31", field2: "value32", field3: "value" },
    ],
    config: {
      options: {
        sortable: {
          onSort,
        },
      },
      columns: [
        { key: "field1" },
        { key: "field2", sortable: true },
        { key: "field3" },
      ],
    } as TableConfig<TestData>,
    ...additionalProps,
  };
};

const sortedDesc = [
  { field1: "value31", field2: "value32", field3: "value" },
  { field1: "value21", field2: "value22", field3: "value" },
  { field1: "value11", field2: "value12", field3: "value" },
];

describe("Table", () => {
  it("renders table", () => {
    const props = getDefaultTestProps();
    const wrapper = shallow(<DynamicTable {...props} />);

    expect(wrapper.find(TableHeaderRenderer).length).toEqual(1);
    expect(wrapper.find(TableBody).length).toEqual(1);
    expect(wrapper.find(TableRows).length).toEqual(1);
    expect(wrapper.find(TableGroups).length).toEqual(0);
  });

  it("renders table with groups", () => {
    const props = getDefaultTestProps({
      groupedData: [
        {
          name: "label1",
          data: getDefaultTestProps().data,
        },
      ],
    });
    const wrapper = shallow(<DynamicTable {...props} />);

    expect(wrapper.find(TableHeaderRenderer).length).toEqual(1);
    expect(wrapper.find(TableBody).length).toEqual(1);
    expect(wrapper.find(TableGroups).length).toEqual(1);
    expect(wrapper.find(TableRows).length).toEqual(0);
  });

  it("renders rows when groupedData is an empty array", () => {
    const props = getDefaultTestProps({
      groupedData: [],
    });
    const wrapper = shallow(<DynamicTable {...props} />);

    expect(wrapper.find(TableGroups).length).toEqual(0);
    expect(wrapper.find(TableRows).length).toEqual(1);
  });

  describe("Sorting", () => {
    it("default", () => {
      let dataFromCallback = [];
      const props = getDefaultTestProps({}, (data) => {
        dataFromCallback = data;
      });
      const wrapper = mount(<DynamicTable {...props} />);

      const sortIcons = wrapper.find(Icon);
      const defaultSortTrigger = sortIcons.at(0);

      expect(sortIcons.length).toEqual(1);

      expect(wrapper.state("sortDirection")).toEqual("asc");
      defaultSortTrigger.simulate("click");
      expect(wrapper.state("sortDirection")).toEqual("desc");
      expect(dataFromCallback).toEqual(sortedDesc);
    });

    it("custom with callback", () => {
      let shuffled = [];
      let dataFromCallback = [];
      const config = {
        options: {
          sortable: {
            onSort: (data) => {
              dataFromCallback = data;
            },
          },
        },
        columns: [
          { key: "field1" },
          {
            key: "field2",
            sortable: true,
            sortingFunction: (data) => {
              shuffled = shuffle(data);
              return shuffled;
            },
          },
        ],
      } as TableConfig<TestData>;

      const props = getDefaultTestProps({ config });
      const wrapper = mount(<DynamicTable {...props} />);

      const sortIcons = wrapper.find(Icon);
      const defaultSortTrigger = sortIcons.at(0);

      expect(sortIcons.length).toEqual(1);

      defaultSortTrigger.simulate("click");
      expect(wrapper.state("sortDirection")).toEqual("desc");
      expect(dataFromCallback).toEqual(shuffled);

      defaultSortTrigger.simulate("click");
      expect(wrapper.state("sortDirection")).toEqual("asc");
      expect(dataFromCallback).toEqual(shuffled.reverse());
    });

    it("displays default sort icon", () => {
      const config = {
        options: {
          sortable: {
            sortKey: "field1",
            initialSortDirection: "asc",
            onSort: () => {},
          },
        },
        columns: [
          { key: "field1", sortable: true },
          { key: "field2", sortable: true },
          { key: "field3", sortable: false },
        ],
      } as TableConfig<TestData>;

      const props = getDefaultTestProps({ config });
      const wrapper = mount(<DynamicTable {...props} />);

      let sortIcons = wrapper.find('[data-sk-name="sort-icon"]');

      expect(wrapper.state("sortDirection")).toEqual("asc");
      expect(sortIcons.length).toEqual(2);
      expect(
        sortIcons.at(0).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(true);
      expect(
        sortIcons.at(1).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(false);

      wrapper.find(Icon).at(1).simulate("click");
      sortIcons = wrapper.find('[data-sk-name="sort-icon"]');

      expect(wrapper.state("sortDirection")).toEqual("desc");
      expect(
        sortIcons.at(0).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(false);
      expect(
        sortIcons.at(1).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(true);
    });

    it("displays sort icon on sort", () => {
      const config = {
        options: {
          sortable: {
            onSort: () => {},
          },
        },
        columns: [
          { key: "field1", sortable: true },
          { key: "field2", sortable: true },
          { key: "field3", sortable: false },
        ],
      } as TableConfig<TestData>;

      const props = getDefaultTestProps({ config });
      const wrapper = mount(<DynamicTable {...props} />);

      let sortIcons = wrapper.find('[data-sk-name="sort-icon"]');

      expect(wrapper.state("sortDirection")).toEqual("asc");
      expect(sortIcons.length).toEqual(2);
      expect(
        sortIcons.at(0).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(false);
      expect(
        sortIcons.at(1).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(false);

      wrapper.find(Icon).at(0).simulate("click");
      sortIcons = wrapper.find('[data-sk-name="sort-icon"]');

      expect(wrapper.state("sortDirection")).toEqual("desc");
      expect(
        sortIcons.at(0).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(true);
      expect(
        sortIcons.at(1).hasClass("sked-table-header-cell-icon--sortedBy")
      ).toEqual(false);
    });

    it("sort icons hidden without config options", () => {
      const config = {
        options: {
          sortable: {
            onSort: () => {},
          },
        },
        columns: [
          { key: "field1", sortable: false },
          { key: "field2", sortable: false },
          { key: "field3" },
        ],
      } as TableConfig<TestData>;

      const props = getDefaultTestProps({ config });
      const wrapper = mount(<DynamicTable {...props} />);
      const sortIcons = wrapper.find('[data-sk-name="sort-icon"]');

      expect(sortIcons.length).toEqual(0);
    });
  });

  describe("Select", () => {
    it("prevents to select by keys with non unique values ", () => {
      const props = getDefaultTestProps();
      const selectable = {
        selectBy: "field3" as keyof TestData,
        onSelect: () => {},
      };

      expect(() =>
        shallow(
          <DynamicTable
            {...props}
            config={{ ...props.config, options: { selectable } }}
          />
        )
      ).toThrowError();
    });

    it("setting state and executing callback", () => {
      const props = getDefaultTestProps();
      const onSelect = jest.fn((selectBy, selection, data) => selection);
      const selectable = {
        onSelect,
        selectBy: "field1" as keyof TestData,
        selectAll: true,
      };

      const wrapper = mount(
        <DynamicTable
          {...props}
          config={{ ...props.config, options: { selectable } }}
        />
      );

      const selectInput = (num) =>
        wrapper
          .find('tr[data-sk-name="sked-table-row-renderer"]')
          .at(num)
          .find(FormInputElement);
      const selectedValue = (num) => props.data[num].field1;

      const toggle = (num, on = true) =>
        selectInput(num).simulate("change", { target: { checked: on } });

      expect(selectInput(0).length).toEqual(1);

      toggle(0);
      expect(wrapper.state("selection")).toContain(selectedValue(0));

      toggle(0, false);
      expect(wrapper.state("selection")).not.toContain(selectedValue(0));

      toggle(1);
      toggle(2);
      expect(wrapper.state("selection")).toContain(selectedValue(1));
      expect(wrapper.state("selection")).toContain(selectedValue(2));

      toggle(1, false);
      toggle(2, false);
      expect(wrapper.state("selection")).toEqual(new Set());

      const selectAll = wrapper
        .find(TableHeaderRenderer)
        .first()
        .find(FormInputElement);
      selectAll.simulate("change", { target: { checked: true } });
      expect(wrapper.state("selection")).toContain(selectedValue(0));
      expect(wrapper.state("selection")).toContain(selectedValue(1));
      expect(wrapper.state("selection")).toContain(selectedValue(2));

      toggle(1, false);
      expect(wrapper.state("selection")).toContain(selectedValue(0));
      expect(wrapper.state("selection")).not.toContain(selectedValue(1));
      expect(wrapper.state("selection")).toContain(selectedValue(2));

      selectAll.simulate("change", { target: { checked: true } });
      expect(wrapper.state("selection")).toContain(selectedValue(0));
      expect(wrapper.state("selection")).toContain(selectedValue(1));
      expect(wrapper.state("selection")).toContain(selectedValue(2));

      expect(onSelect).toHaveLastReturnedWith(
        new Set(["value11", "value21", "value31"])
      );
    });
  });
});
