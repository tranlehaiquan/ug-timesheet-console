import * as React from "react";
import { noop } from "lodash";
import { mount } from "enzyme";

import {
  SkedFormValidation,
  SkedFormValidationState,
} from "./SkedFormValidation";
import { Button } from "../buttons/button/Button";
import { FormElementWrapper, FormInputElement } from "./FormElements";
import { ReadOnly } from "./ReadOnly";

describe("SkedFormValidation", () => {
  const config = {
    test: {
      isRequired: "test is required",
    },
    anotherTest: {
      isRequired: "this other Test is Required",
    },
  };

  const onSubmit = jest.fn().mockReturnValue(false);

  test("tracks modified fields, adds only on input value change", () => {
    // Arrange
    const wrapper = mount<{}, SkedFormValidationState<{}>>(
      <SkedFormValidation
        config={config}
        onSubmit={onSubmit}
        initialValues={{ test: "" }}
      >
        {() => <input id="input" type="text" name="test" />}
      </SkedFormValidation>
    );

    // Act
    const input = wrapper.find("input");

    // Assert
    input.simulate("blur", { target: { name: "test", value: "" } });
    expect(wrapper.state().fieldsModified.has("test")).toEqual(false);

    input.simulate("blur", { target: { name: "test", value: "hi" } });
    expect(wrapper.state().fieldsModified.has("test")).toEqual(true);
    wrapper.unmount();
  });

  test("will set fields if initialValues change", () => {
    // Arrange
    const wrapper = mount<{}, SkedFormValidationState<{}>>(
      <SkedFormValidation
        config={{ test: {} }}
        onSubmit={onSubmit}
        initialValues={{}}
      >
        {({ fields }) => (
          <FormElementWrapper>
            <FormInputElement
              onChange={noop}
              name="test"
              type="text"
              value={fields.test}
              data-sk-name="TestInput"
            />
          </FormElementWrapper>
        )}
      </SkedFormValidation>
    );

    // Act
    wrapper.setProps({ initialValues: { test: "Updated" } });
    wrapper.update();

    // Assert
    expect(
      wrapper.find('[data-sk-name="TestInput"]').first().props().value
    ).toBe("Updated");
  });

  describe("submit", () => {
    test("wont set form back to read only if normal form", () => {
      // Arrange
      const wrapper = mount<{}, SkedFormValidationState<{}>>(
        <SkedFormValidation
          config={{ test: {} }}
          onSubmit={onSubmit}
          initialValues={{ test: "Hello" }}
        >
          {({ fields, isFormReadonly, submit }) => (
            <>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
              >
                <FormInputElement
                  onChange={noop}
                  name="test"
                  type="text"
                  value={fields.test}
                  data-sk-name="TestInput"
                />
              </FormElementWrapper>
              {!isFormReadonly && <Button onClick={submit}>Cancel</Button>}
            </>
          )}
        </SkedFormValidation>
      );

      // Act
      // Update the form input
      const firstInput = wrapper.find(FormInputElement).first();
      firstInput.simulate("change", {
        target: { name: "test", value: "updated value" },
      });

      // Save click
      wrapper.find(Button).simulate("click");

      // Assert
      expect(onSubmit).toBeCalled();

      return Promise.resolve(() => {
        // Make sure the new fields have been saved in state
        expect(wrapper.find(FormElementWrapper)).toHaveLength(1);
      });
    });

    test("submit with a Promise", () => {
      const submit = jest.fn(() => Promise.resolve("Submitted"));
      // Arrange
      const wrapper = mount<{}, SkedFormValidationState<{}>>(
        <SkedFormValidation
          config={{ test: {} }}
          onSubmit={submit}
          initialValues={{ test: "Hello" }}
        >
          {({ fields, isFormReadonly, submit }) => (
            <>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
              >
                <FormInputElement
                  onChange={noop}
                  name="test"
                  type="text"
                  value={fields.test}
                  data-sk-name="TestInput"
                />
              </FormElementWrapper>
              {!isFormReadonly && <Button onClick={submit}>Cancel</Button>}
            </>
          )}
        </SkedFormValidation>
      );

      // Act
      // Update the form input
      const firstInput = wrapper.find(FormInputElement).first();
      firstInput.simulate("change", {
        target: { name: "test", value: "updated value" },
      });

      // Save click
      wrapper.find(Button).simulate("click");

      // Assert
      const formDataPayload = {
        fields: { test: "updated value" },
        errors: { test: null },
        isValid: true,
      };

      expect(submit).toBeCalled();
      expect(submit).toBeCalledWith(formDataPayload);

      return Promise.resolve(() => {
        // Make sure the new fields have been saved in state
        expect(wrapper.state().initialValues).toEqual(formDataPayload.fields);
      });
    });

    test("regular submit", () => {
      // Arrange
      const wrapper = mount<{}, SkedFormValidationState<{}>>(
        <SkedFormValidation
          config={{ test: {} }}
          onSubmit={onSubmit}
          initialValues={{ test: "Hello" }}
        >
          {({ fields, isFormReadonly, submit }) => (
            <>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
                data-sk-name="form-element-wrapper"
              >
                <FormInputElement
                  onChange={noop}
                  name="test"
                  type="text"
                  value={fields.test}
                />
              </FormElementWrapper>
              {!isFormReadonly && <Button onClick={submit}>Cancel</Button>}
            </>
          )}
        </SkedFormValidation>
      );

      // Act
      // Update the form input
      const firstInput = wrapper.find(FormInputElement).first();
      firstInput.simulate("change", {
        target: { name: "test", value: "updated value" },
      });

      // Save click
      wrapper.find(Button).simulate("click");

      // Assert
      const formDataPayload = {
        fields: { test: "updated value" },
        errors: { test: null },
        isValid: true,
      };

      expect(onSubmit).toBeCalled();
      expect(onSubmit).toBeCalledWith(formDataPayload);

      return Promise.resolve(() => {
        // Make sure the new fields have been saved in state
        expect(wrapper.state().initialValues).toEqual(formDataPayload.fields);
      });
    });
  });

  describe("resetFieldsToInitialValues", () => {
    test("will reset form back to initial values", () => {
      // Arrange
      const initialValues = { test: "Hello world" };

      const wrapper = mount(
        <SkedFormValidation
          config={{ test: {} }}
          onSubmit={onSubmit}
          initialValues={initialValues}
        >
          {({ fields, isFormReadonly, resetFieldsToInitialValues }) => (
            <>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
              >
                <FormInputElement
                  onChange={noop}
                  name="test"
                  type="text"
                  value={fields.test}
                />
              </FormElementWrapper>
              {!isFormReadonly && (
                <Button onClick={resetFieldsToInitialValues}>Cancel</Button>
              )}
            </>
          )}
        </SkedFormValidation>
      );

      // Act
      const firstInput = wrapper.find(FormInputElement).first();
      firstInput.simulate("change", {
        target: { name: "test", value: "New Value" },
      });

      // Cancel click
      wrapper.find(Button).simulate("click");

      // Assert
      expect(firstInput.props().value).toBe("Hello world");
    });

    test("will reset form back to blank fields if no initial value is passed", () => {
      // Arrange
      const wrapper = mount(
        <SkedFormValidation
          config={{ test: {} }}
          onSubmit={onSubmit}
          initialValues={{}}
        >
          {({ fields, isFormReadonly, resetFieldsToInitialValues }) => (
            <>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
              >
                <FormInputElement
                  onChange={noop}
                  name="test"
                  type="text"
                  value={fields.test}
                />
              </FormElementWrapper>
              {!isFormReadonly && (
                <Button onClick={resetFieldsToInitialValues}>Cancel</Button>
              )}
            </>
          )}
        </SkedFormValidation>
      );

      // Act
      const firstInput = wrapper.find(FormInputElement).first();
      firstInput.simulate("change", {
        target: { name: "test", value: "New Value" },
      });

      // Cancel click
      wrapper.find(Button).simulate("click");

      // Assert
      expect(firstInput.props().value).toBe("");
    });
  });

  describe("Click to edit", () => {
    test('clicking a readOnly field toggles editable mode, calling "setFormReadOnly" will show readOnly', () => {
      // Arrange
      const wrapper = mount(
        <SkedFormValidation
          config={config}
          onSubmit={onSubmit}
          initialValues={{ test: "Hello world" }}
          options={{ clickToEdit: true }}
        >
          {({ fields, isFormReadonly, setFormReadonly }) => (
            <>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
                data-sk-name="form-element-wrapper"
              >
                <FormInputElement
                  type="text"
                  value={fields.test}
                  onChange={noop}
                />
              </FormElementWrapper>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
                data-sk-name="form-element-wrapper"
              >
                <FormInputElement
                  type="text"
                  value={fields.anotherTest}
                  onChange={noop}
                />
              </FormElementWrapper>
              {!isFormReadonly && (
                <Button onClick={setFormReadonly}>Cancel</Button>
              )}
            </>
          )}
        </SkedFormValidation>
      );

      // Act
      // Just using the icon to target the click
      wrapper
        .find('[data-sk-name="form-element-wrapper"]')
        .first()
        .simulate("click", { target: { getAttribute: () => "true" } });

      expect(wrapper.find(Button)).toHaveLength(1);
      expect(wrapper.find(FormInputElement)).toHaveLength(2);

      // Cancel click
      wrapper.find(Button).simulate("click");
      wrapper.update();
      expect(wrapper.find(Button)).toHaveLength(0);
      expect(wrapper.find(FormInputElement)).toHaveLength(0);
      expect(wrapper.find(ReadOnly)).toHaveLength(2);
    });

    test("submitting form updates the initial value state, and sets the field back to read only", () => {
      // Arrange
      const initialValues = { test: "Hello world" };
      const wrapper = mount<{}, SkedFormValidationState<{}>>(
        <SkedFormValidation
          config={{ test: {} }}
          onSubmit={onSubmit}
          initialValues={initialValues}
          options={{ clickToEdit: true }}
          data-sk-name="form-element-wrapper"
        >
          {({ fields, isFormReadonly, submit }) => (
            <>
              <FormElementWrapper
                readOnlyValue={fields.test}
                isReadOnly={isFormReadonly}
              >
                <FormInputElement
                  onChange={noop}
                  name="test"
                  type="text"
                  value={fields.test}
                />
              </FormElementWrapper>
              {!isFormReadonly && <Button onClick={submit}>Save</Button>}
            </>
          )}
        </SkedFormValidation>
      );

      // Act
      wrapper
        .find('[data-sk-name="form-element-wrapper"]')
        .simulate("click", { target: { getAttribute: () => "true" } });

      expect(wrapper.state().initialValues).toEqual(initialValues);

      const firstInput = wrapper.find(FormInputElement).first();
      firstInput.simulate("change", {
        target: { name: "test", value: "New Value" },
      });

      // Save click
      wrapper.find(Button).simulate("click");

      return Promise.resolve(() => {
        // Assert
        expect(wrapper.state().initialValues).toEqual({ test: "New Value" });
        expect(
          wrapper.find('[data-sk-name="form-element-wrapper"]')
        ).toHaveLength(1);
      });
    });
  });
});
