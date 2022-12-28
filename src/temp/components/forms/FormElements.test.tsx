import * as React from "react";
import { shallow } from "enzyme";

import {
  FormLabel,
  FormInputElement,
  FormElementWrapper,
  FormValidationCallout,
} from "./FormElements";

describe("FormElements", () => {
  describe("FormLabel", () => {
    it("shows optional tag", () => {
      const wrapper = shallow(<FormLabel optional />);
      expect(wrapper.find('[data-sk-name="optional"]').length).toEqual(1);
    });
  });

  describe("FormInputElement", () => {
    it("creates input type specified", () => {
      const wrapper = shallow(
        <FormInputElement type="text" data-sk-name="text-input" />
      );
      expect(wrapper.find('[data-sk-name="text-input"]').length).toEqual(1);
    });

    it("creates label if specified", () => {
      const wrapper = shallow(
        <FormInputElement type="radio" inlineLabel="Label text" />
      );
      expect(wrapper.find("FormLabel").length).toEqual(1);
    });

    it("applies the class to the input", () => {
      const wrapper = shallow(
        <FormInputElement type="input" className="so-fresh-and-so-clean" />
      );
      expect(wrapper.find("input").prop("className")).toContain(
        "so-fresh-and-so-clean"
      );
    });

    it("applies the inlineLabelClassName to the inline label", () => {
      const wrapper = shallow(
        <FormInputElement
          type="input"
          inlineLabel="Inline label is inline"
          inlineLabelClassName="clean-clean"
        />
      );
      expect(wrapper.find(FormLabel).prop("className")).toContain(
        "clean-clean"
      );
    });

    it("adds outline class if of text type", () => {
      const wrapper = shallow(<FormInputElement type="text" />);
      expect(wrapper.find("input").hasClass("sked-form-element__outline")).toBe(
        true
      );
    });

    it("sets up label for attribut for inline labels", () => {
      const wrapper = shallow(
        <FormInputElement
          id="textid"
          type="checkbox"
          inlineLabel="Label text"
        />
      );
      expect(wrapper.find("FormLabel").prop("htmlFor")).toBeDefined;
      expect(wrapper.find("FormLabel").prop("htmlFor")).toEqual("textid");
    });
  });

  describe("FormElementWrapper", () => {
    it("shows error if invalid", () => {
      const wrapper = shallow(
        <FormElementWrapper
          validation={{ isValid: false, error: "Error text" }}
        >
          <input />
        </FormElementWrapper>
      );
      expect(wrapper.find('[data-sk-name="form-error-text"]').length).toEqual(
        1
      );
    });
  });

  describe("FormValidationCallout", () => {
    it("shows error if invalid", () => {
      const wrapper = shallow(
        <FormValidationCallout
          validation={{ isValid: false, error: "Error text" }}
        />
      );
      expect(wrapper.find('[data-sk-name="callout-error"]').length).toEqual(1);
    });
  });
});
