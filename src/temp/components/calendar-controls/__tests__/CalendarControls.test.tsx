import * as React from "react";
import { mount, shallow } from "enzyme";
import { format } from "date-fns";

import { CalendarControls } from "../CalendarControls";
import { Button } from "../../buttons/button/Button";
import { ButtonDropdown } from "../../buttons/button-dropdown/ButtonDropdown";
import { Datepicker } from "../../datepicker/Datepicker";
import { MenuItem } from "../../menu/Menu";

const formatDate = (date: Date) => format(date, "YYYY-MM-DD");

describe("CalendarControls", () => {
  it("renders expected components", () => {
    const component = mount<CalendarControls>(
      <CalendarControls selected={new Date()} />
    );

    expect(component.find('[data-sk-name="today-button"]').length).toEqual(1);
    expect(
      component.find('[data-sk-name="today-button"]').find(Button).length
    ).toEqual(1);

    expect(
      component.find('[data-sk-name="navigation-buttons"]').length
    ).toEqual(1);
    expect(
      component.find('[data-sk-name="navigation-buttons"]').find(Button).length
    ).toEqual(2);

    expect(component.find('[data-sk-name="date-selector"]').length).toEqual(1);
    expect(
      component.find('[data-sk-name="date-selector"]').find(Datepicker).length
    ).toEqual(1);

    expect(component.find('[data-sk-name="range-picker"]').length).toEqual(1);
    expect(
      component.find('[data-sk-name="range-picker"]').find(ButtonDropdown)
        .length
    ).toEqual(1);
  });

  describe("today", () => {
    it("should return today's date to become the selected date", () => {
      const onDateSelect = jest.fn();
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-05-01")}
          onDateSelect={onDateSelect}
        />
      );

      wrapper
        .find('[data-sk-name="today-button"]')
        .find(Button)
        .simulate("click");
      expect(onDateSelect).toBeCalled();

      const [today] = onDateSelect.mock.calls[0];
      expect(formatDate(today)).toEqual(formatDate(new Date()));
    });
  });

  describe("navigation buttons", () => {
    describe("forward buttons", () => {
      it("should move forward 1 day", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="day"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-forwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-05-02");
      });

      it("should move forward 3 days", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="3-days"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-forwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-05-04");
      });

      it("should move forward 7 days", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="week"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-forwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-05-08");
      });

      it("should move forward 1 month", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="month"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-forwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-06-01");
      });
    });

    describe("backward buttons", () => {
      it("should move backward 1 day", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="day"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-backwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-04-30");
      });

      it("should move backward 3 days", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="3-days"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-backwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-04-28");
      });

      it("should move backward 7 days", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="week"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-backwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-04-24");
      });

      it("should move backward 1 month", () => {
        const onDateSelect = jest.fn();
        const wrapper = mount<CalendarControls>(
          <CalendarControls
            selected={new Date("2019-05-01")}
            onDateSelect={onDateSelect}
            selectedRange="month"
          />
        );
        wrapper
          .find('button[data-sk-name="navigate-backwards"]')
          .simulate("click");

        const [newDate] = onDateSelect.mock.calls[0];
        expect(formatDate(newDate)).toEqual("2019-04-01");
      });
    });
  });

  describe("date selector", () => {
    it("should render a single date", () => {
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-05-01")}
          selectedRange="day"
        />
      );
      expect(
        wrapper.find('[data-sk-name="date-range-display"] .sk-visible').text()
      ).toEqual("May 01, 2019");
    });

    it("should render 3 days apart", () => {
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-05-01")}
          selectedRange="3-days"
        />
      );
      expect(
        wrapper.find('[data-sk-name="date-range-display"] .sk-visible').text()
      ).toEqual("May 01 - May 03, 2019");
    });

    it("should render 7 days apart", () => {
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-05-01")}
          selectedRange="week"
        />
      );
      expect(
        wrapper.find('[data-sk-name="date-range-display"] .sk-visible').text()
      ).toEqual("May 01 - May 07, 2019");
    });

    it("should render 1 month apart", () => {
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-05-01")}
          selectedRange="month"
        />
      );
      expect(
        wrapper.find('[data-sk-name="date-range-display"] .sk-visible').text()
      ).toEqual("May 01 - May 31, 2019");
    });

    it("should contain both years if across a new year apart", () => {
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-12-21")}
          selectedRange="month"
        />
      );
      expect(
        wrapper.find('[data-sk-name="date-range-display"] .sk-visible').text()
      ).toEqual("Dec 21, 2019 - Jan 20, 2020");
    });

    it("should show the date picker on click", () => {
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-12-21")}
          selectedRange="month"
        />
      );
      wrapper
        .find('button[data-sk-name="date-range-display"]')
        .simulate("click");

      expect(wrapper.find("Day")).toHaveLength(35);
    });
  });

  describe("range picker", () => {
    it("should show only chosen options", () => {
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-12-21")}
          rangeOptions={["day", "month"]}
          selectedRange="month"
        />
      );
      wrapper
        .find('button[data-sk-name="date-range-picker"]')
        .simulate("click");

      expect(wrapper.find(MenuItem)).toHaveLength(2);
      expect(wrapper.find(MenuItem).map((item) => item.text())).toEqual([
        "day",
        "month",
      ]);
    });

    it("should forward selection on click", () => {
      const onRangeChange = jest.fn();
      const wrapper = mount<CalendarControls>(
        <CalendarControls
          selected={new Date("2019-12-21")}
          onRangeChange={onRangeChange}
          rangeOptions={["day", "3-days", "month"]}
          selectedRange="month"
        />
      );

      wrapper
        .find('button[data-sk-name="date-range-picker"]')
        .simulate("click");
      wrapper.find(MenuItem).at(0).simulate("click");
      expect(onRangeChange.mock.calls[0][0]).toEqual("day");

      // Ensure it works on other fields
      wrapper
        .find('button[data-sk-name="date-range-picker"]')
        .simulate("click");
      wrapper.find(MenuItem).at(1).simulate("click");
      expect(onRangeChange.mock.calls[1][0]).toEqual("3-days");
    });
  });
});
