import * as React from "react";
import { mount } from "enzyme";
import range from "lodash/range";

import BaseDatePicker from "react-datepicker";
import { Datepicker, IProps as DateProps } from "../Datepicker";
import { FormInputElement } from "../../forms/FormElements";

describe("DatePicker", () => {
  test("renders closed, with FormInputElement by default", () => {
    const date = new Date("2019-05-10");
    const startDate = new Date("2019-05-01");
    const endDate = new Date("2019-05-31");
    const component = mount<DateProps, Datepicker>(
      <Datepicker selected={date} startDate={startDate} endDate={endDate} />
    );

    // Using instance on the nested component as we can't use `.state()` when the wrapping component is a functional component
    expect(component.find(BaseDatePicker).instance().state.open).toEqual(false);
    expect(component.find(FormInputElement).length).toEqual(1);
  });

  test("opens when default input is clicked", () => {
    const date = new Date("2019-05-10");
    const startDate = new Date("2019-05-01");
    const endDate = new Date("2019-05-31");
    const component = mount<DateProps, Datepicker>(
      <Datepicker selected={date} startDate={startDate} endDate={endDate} />
    );
    component.find("input").simulate("click");

    // Using instance on the nested component as we can't use `.state()` when the wrapping component is a functional component
    expect(component.find(BaseDatePicker).instance().state.open).toEqual(true);
  });

  test("when inline, this calendar is displayed in full", () => {
    const date = new Date("2019-05-10");
    const startDate = new Date("2019-05-01");
    const endDate = new Date("2019-05-31");
    const component = mount<DateProps, Datepicker>(
      <Datepicker
        inline
        selected={date}
        startDate={startDate}
        endDate={endDate}
      />
    );

    expect(component.find(".react-datepicker__day").length).toEqual(35); // Days of month plus before and after
  });

  test("renders a custom component", () => {
    const date = new Date("2019-05-10");
    const startDate = new Date("2019-05-01");
    const endDate = new Date("2019-05-31");
    const CustomComponent = React.forwardRef((props, _ref) => (
      <span data-sk-name="My test component" {...props} />
    ));
    const component = mount<DateProps, Datepicker>(
      <Datepicker
        customInput={<CustomComponent />}
        selected={date}
        startDate={startDate}
        endDate={endDate}
      />
    );

    expect(component.find(CustomComponent).length).toEqual(1);
  });

  test("highlights selected dates", () => {
    const date = new Date("2019-05-10");
    const startDate = new Date("2019-05-01");
    const endDate = new Date("2019-05-31");
    const highlightedDates = range(1, 8).map((i) => new Date(`2019-05-0${i}`));
    const component = mount<DateProps, Datepicker>(
      <Datepicker
        inline
        highlightDates={highlightedDates}
        selected={date}
        startDate={startDate}
        endDate={endDate}
      />
    );

    expect(
      component.find('.react-datepicker__day--highlighted[aria-label="day-1"]')
        .length
    ).toEqual(1);
    expect(
      component.find('.react-datepicker__day--highlighted[aria-label="day-2"]')
        .length
    ).toEqual(1);
    expect(
      component.find('.react-datepicker__day--highlighted[aria-label="day-3"]')
        .length
    ).toEqual(1);
    expect(
      component.find('.react-datepicker__day--highlighted[aria-label="day-4"]')
        .length
    ).toEqual(1);
    expect(
      component.find('.react-datepicker__day--highlighted[aria-label="day-5"]')
        .length
    ).toEqual(1);
    expect(
      component.find('.react-datepicker__day--highlighted[aria-label="day-6"]')
        .length
    ).toEqual(1);
    expect(
      component.find('.react-datepicker__day--highlighted[aria-label="day-7"]')
        .length
    ).toEqual(1);
  });

  describe("selected week", () => {
    describe("selected mid week", () => {
      test("provides full week dates to onWeekSelect callback", () => {
        const SUNDAY = 25;
        const weekSelect = jest.fn();
        const date = new Date("2019-05-10");
        const component = mount<DateProps, Datepicker>(
          <Datepicker inline onWeekSelect={weekSelect} openToDate={date} />
        );
        component
          .find("div.react-datepicker__day")
          .findWhere((div) => div.text() && div.text().includes("27"))
          .simulate("click");

        range(7).forEach(
          (i) => weekSelect.mock.calls[0][0][i].getDate() === SUNDAY + i
        );
      });

      test("highlights the week which is selected", () => {
        const date = new Date("2019-05-10");
        const component = mount<DateProps, Datepicker>(
          <Datepicker inline selectWeek openToDate={date} selected={date} />
        );

        expect(
          component.find(".react-datepicker__day--week-selected").length
        ).toEqual(7);
      });
    });

    describe("selected sunday", () => {
      test("provides full week dates to onWeekSelect callback", () => {
        const SUNDAY = 25;
        const weekSelect = jest.fn();
        const date = new Date("2019-05-10");
        const component = mount<DateProps, Datepicker>(
          <Datepicker inline onWeekSelect={weekSelect} openToDate={date} />
        );
        component
          .find("div.react-datepicker__day")
          .findWhere((div) => div.text() && div.text().includes("25"))
          .simulate("click");

        range(7).forEach(
          (i) => weekSelect.mock.calls[0][0][i].getDate() === SUNDAY + i
        );
      });
    });

    describe("selected saturday following month", () => {
      test("provides full week dates to onWeekSelect callback, and works across month", () => {
        const SUNDAY = 25;
        const weekSelect = jest.fn();
        const date = new Date("2019-05-10");
        const component = mount<DateProps, Datepicker>(
          <Datepicker inline onWeekSelect={weekSelect} openToDate={date} />
        );
        component
          .find("div.react-datepicker__day--outside-month")
          .findWhere((div) => div.text() && div.text().includes("1"))
          .simulate("click");

        range(7).forEach(
          (i) => weekSelect.mock.calls[0][0][i].getDate() === SUNDAY + i
        );
      });
    });
  });

  describe("highlights week", () => {
    test("highlights a week including the date selected", () => {
      const date = new Date("2019-05-10");
      const component = mount<DateProps, Datepicker>(
        <Datepicker inline highlightWeek={date} openToDate={date} />
      );

      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-5"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-6"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-7"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-8"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-9"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-10"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-11"]'
        ).length
      ).toEqual(1);
    });

    test("highlights the week starting with sunday selected", () => {
      const date = new Date("2019-05-05");
      const component = mount<DateProps, Datepicker>(
        <Datepicker inline highlightWeek={date} openToDate={date} />
      );

      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-5"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-6"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-7"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-8"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-9"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-10"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-11"]'
        ).length
      ).toEqual(1);
    });

    test("highlights the week ending with saturday selected", () => {
      const date = new Date("2019-05-11");
      const component = mount<DateProps, Datepicker>(
        <Datepicker inline highlightWeek={date} openToDate={date} />
      );

      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-5"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-6"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-7"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-8"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-9"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-10"]'
        ).length
      ).toEqual(1);
      expect(
        component.find(
          '.react-datepicker__day--week-hovered[aria-label="day-11"]'
        ).length
      ).toEqual(1);
    });
  });

  test("the form input is disabled when the datepicker is disabled", () => {
    const date = new Date("2019-05-10");
    const startDate = new Date("2019-05-01");
    const endDate = new Date("2019-05-31");
    const component = mount<DateProps, Datepicker>(
      <Datepicker
        disabled
        selected={date}
        startDate={startDate}
        endDate={endDate}
      />
    );

    expect(component.find("input[disabled=true]").length).toEqual(1);
    expect(component.find(FormInputElement).prop("disabled")).toEqual(true);
  });
});
