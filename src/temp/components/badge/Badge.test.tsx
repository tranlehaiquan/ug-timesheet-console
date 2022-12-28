import * as React from "react";
import { shallow } from "enzyme";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("it renders default badge correctly", () => {
    const wrapper = shallow(<Badge count={1} />);

    expect(wrapper.find('[data-sk-name="sk-badge-default"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-default"]').text()).toEqual(
      "1"
    );
  });

  it("it renders default badge styles correctly", () => {
    const wrapper = shallow(<Badge count={1} />);

    // default elment styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-default"]')
        .hasClass(
          "sked-badge-min-w sk-text-xxs sk-font-medium sk-tracking-wide sk-h-5 sk-pb-px sk-rounded-full sk-inline-flex sk-items-center sk-justify-center"
        )
    ).toBe(true);
    // badge type specific styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-default"]')
        .hasClass("sk-text-blue sk-bg-blue-lightest")
    ).toBe(true);
  });

  it("it renders primary badge styles correctly", () => {
    const wrapper = shallow(<Badge count={1} badgeType={"primary"} />);

    // default elment styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-primary"]')
        .hasClass(
          "sked-badge-min-w sk-text-xxs sk-font-medium sk-tracking-wide sk-h-5 sk-pb-px sk-rounded-full sk-inline-flex sk-items-center sk-justify-center"
        )
    ).toBe(true);
    // badge type specific styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-primary"]')
        .hasClass("sk-text-white sk-bg-blue")
    ).toBe(true);
  });

  it("it renders important badge styles correctly", () => {
    const wrapper = shallow(<Badge count={1} badgeType={"important"} />);

    // default elment styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-important"]')
        .hasClass(
          "sked-badge-min-w sk-text-xxs sk-font-medium sk-tracking-wide sk-h-5 sk-pb-px sk-rounded-full sk-inline-flex sk-items-center sk-justify-center"
        )
    ).toBe(true);
    // badge type specific styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-important"]')
        .hasClass("sk-text-white sk-bg-red")
    ).toBe(true);
  });

  it("it renders neutral badge styles correctly", () => {
    const wrapper = shallow(<Badge count={1} badgeType={"neutral"} />);

    // default elment styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-neutral"]')
        .hasClass(
          "sked-badge-min-w sk-text-xxs sk-font-medium sk-tracking-wide sk-h-5 sk-pb-px sk-rounded-full sk-inline-flex sk-items-center sk-justify-center"
        )
    ).toBe(true);
    // badge type specific styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-neutral"]')
        .hasClass("sk-text-navy-light sk-bg-grey-lighter")
    ).toBe(true);
  });

  it("it renders badge styles for badge with one digit correctly", () => {
    const wrapper = shallow(<Badge count={1} />);

    // default elment styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-default"]')
        .hasClass(
          "sked-badge-min-w sk-text-xxs sk-font-medium sk-tracking-wide sk-h-5 sk-pb-px sk-rounded-full sk-inline-flex sk-items-center sk-justify-center"
        )
    ).toBe(true);
    // badge content specific styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-default"]')
        .hasClass("sked-badge-wider")
    ).toBe(false);
  });

  it("it renders badge styles for badge with more than one digit correctly", () => {
    const wrapper = shallow(<Badge count={10} />);

    // default elment styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-default"]')
        .hasClass(
          "sked-badge-min-w sk-text-xxs sk-font-medium sk-tracking-wide sk-h-5 sk-pb-px sk-rounded-full sk-inline-flex sk-items-center sk-justify-center"
        )
    ).toBe(true);
    // badge content specific styles
    expect(
      wrapper
        .find('[data-sk-name="sk-badge-default"]')
        .hasClass("sked-badge-wider")
    ).toBe(true);
  });

  it("it renders truncated default badge with default limiter correctly", () => {
    const wrapper = shallow(<Badge count={100} />);

    expect(wrapper.find('[data-sk-name="sk-badge-default"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-default"]').text()).toEqual(
      "99+"
    );
  });

  it("it renders truncated default badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const wrapper = shallow(<Badge count={100} countLimiter={countLimiter} />);

    expect(wrapper.find('[data-sk-name="sk-badge-default"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-default"]').text()).toEqual(
      `${countLimiter}+`
    );
  });

  it("it renders default badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const count = 10;
    const wrapper = shallow(
      <Badge count={count} countLimiter={countLimiter} />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-default"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-default"]').text()).toEqual(
      `${count}`
    );
  });

  it("it renders primary badge with default limiter correctly", () => {
    const count = 10;
    const wrapper = shallow(<Badge count={count} badgeType={"primary"} />);

    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').text()).toEqual(
      `${count}`
    );
  });

  it("it renders truncated primary badge with default limiter correctly", () => {
    const count = 100;
    const wrapper = shallow(<Badge count={count} badgeType={"primary"} />);

    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').text()).toEqual(
      "99+"
    );
  });

  it("it renders truncated primary badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const wrapper = shallow(
      <Badge count={100} countLimiter={countLimiter} badgeType={"primary"} />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').text()).toEqual(
      `${countLimiter}+`
    );
  });

  it("it renders primary badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const count = 10;
    const wrapper = shallow(
      <Badge count={count} countLimiter={countLimiter} badgeType={"primary"} />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-primary"]').text()).toEqual(
      `${count}`
    );
  });

  it("it renders important badge with default limiter correctly", () => {
    const count = 10;
    const wrapper = shallow(<Badge count={count} badgeType={"important"} />);

    expect(wrapper.find('[data-sk-name="sk-badge-important"]').length).toEqual(
      1
    );
    expect(wrapper.find('[data-sk-name="sk-badge-important"]').text()).toEqual(
      `${count}`
    );
  });

  it("it renders truncated important badge with default limiter correctly", () => {
    const count = 100;
    const wrapper = shallow(<Badge count={count} badgeType={"important"} />);

    expect(wrapper.find('[data-sk-name="sk-badge-important"]').length).toEqual(
      1
    );
    expect(wrapper.find('[data-sk-name="sk-badge-important"]').text()).toEqual(
      "99+"
    );
  });

  it("it renders truncated important badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const wrapper = shallow(
      <Badge count={100} countLimiter={countLimiter} badgeType={"important"} />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-important"]').length).toEqual(
      1
    );
    expect(wrapper.find('[data-sk-name="sk-badge-important"]').text()).toEqual(
      `${countLimiter}+`
    );
  });

  it("it renders important badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const count = 10;
    const wrapper = shallow(
      <Badge
        count={count}
        countLimiter={countLimiter}
        badgeType={"important"}
      />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-important"]').length).toEqual(
      1
    );
    expect(wrapper.find('[data-sk-name="sk-badge-important"]').text()).toEqual(
      `${count}`
    );
  });

  it("it renders neutral badge with default limiter correctly", () => {
    const count = 10;
    const wrapper = shallow(<Badge count={count} badgeType={"neutral"} />);

    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').text()).toEqual(
      `${count}`
    );
  });

  it("it renders truncated neutral badge with default limiter correctly", () => {
    const count = 100;
    const wrapper = shallow(<Badge count={count} badgeType={"neutral"} />);

    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').text()).toEqual(
      "99+"
    );
  });

  it("it renders truncated neutral badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const wrapper = shallow(
      <Badge count={100} countLimiter={countLimiter} badgeType={"neutral"} />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').text()).toEqual(
      `${countLimiter}+`
    );
  });

  it("it renders neutral badge with specified limiter correctly", () => {
    const countLimiter = 10;
    const count = 10;
    const wrapper = shallow(
      <Badge count={count} countLimiter={countLimiter} badgeType={"neutral"} />
    );

    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').length).toEqual(1);
    expect(wrapper.find('[data-sk-name="sk-badge-neutral"]').text()).toEqual(
      `${count}`
    );
  });
});
