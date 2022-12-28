import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, select, text } from '@storybook/addon-knobs/react'
import { action } from '@storybook/addon-actions'

import { Button } from '../buttons/button/Button'
import { ButtonGroup } from '../button-group/ButtonGroup'
import { FormInputElement, FormElementWrapper, FormLabel, FormValidationCallout } from './FormElements'
import { SkedFormValidation } from './SkedFormValidation'
import { ReadOnly } from './ReadOnly'

const gridLayout = {
  display: 'inline-grid',
  gridTemplateColumns: '160px auto',
  alignItems: 'baseline',
  gridColumnGap: 10
} as any

storiesOf('Forms/', module)
  .add('Overview', () => (
    <>
      <div className="sk-p-8 sk-max-w-lg sk-text-navy-light sk-leading-normal">
        <h1 className="sk-text-blue sk-text-2xl sk-mb-6">Using forms</h1>
        <p className="sk-mb-4">
          When creating forms, use the <span className="sk-font-semibold">SkedFormValidation</span> component in conjunction with the other form components. Validation works by encapsulating and handling data updates within a form from
          onChange events and running the supplied validation configuration. Creating forms this way means you don't need to create a bunch of update functions for inputs. On form submission the result of the form inputs, errors, and
          validation status is output.
        </p>
        <p className="sk-mb-4">
          <span className="sk-font-semibold">SkedFormValidation</span> is just a wrapper that uses the{ ' ' }
          <a href="https://github.com/selbekk/calidation" target="_blank">
            calidation library
          </a>{ ' ' }
          under the hood which is a tiny nifty validation library that provided a good foundation to build upon. Refer to it's documentation for in depth usage or for a basic example see the SkedFormValidation component. SkedFormValidation
          adds dirty field tracking and validation checker util functions to it.
        </p>
        <p className="sk-mb-4">
          There is a custom update function (customFieldUpdate) that most non standard form element widget will need to use since they don't always emit an onChange event (such as selecting a list item on an autocomplete widget).
        </p>
        <div>
          <h3 className="sk-text-blue sk-text-lg sk-mb-3">Click to edit behaviour</h3>
          <p className="sk-mb-4">
            If you are wanting to create a form that begins in a read only state and toggles to editable on the click of a value, set the options prop key <code>clickToEdit</code> to true on <strong>SkedFormValidation</strong>. This will
            turn on particular behaviour within the form that you can use with the form components to create this kind of form:
            <ul>
              <li>
                The <code>isReadOnly</code> form variable will be set to true by default and <strong>FormElementWrapper</strong> components used within that form show ReadOnly and editable versions of inputs based on this bit of state.
              </li>
              <li>
                The <code>resetFieldsToInitialValues</code> method will reset the form values to the initial values and then switch the form back to read only mode.
              </li>
              <li> Once a form is submitted the form will switch back to read only mode.</li>
            </ul>
          </p>
          <p className="sk-mb-4">
            For the correct input field to be focused when a readonly is clicked, <strong>FormElementWrapper</strong> needs a <code>name</code> prop that maps to the child input <code>name</code> prop.
            <pre className="sk-bg-grey-lightest sk-text-xs sk-p-4 sk-mt-2">
              { `<FormElementWrapper name="first-name">
  <input type="text" name="first-name" />
</FormElementWrapper>
` }
            </pre>
          </p>
          <p>Full Example:</p>
          <pre className="sk-bg-grey-lightest sk-text-xs sk-p-4 sk-mt-2">
            { `<SkedFormValidation { ...props }>
  {({ isFormReadonly, setFormReadonly, fields }) => (
    <div>
      <FormElementWrapper
        name="first-name"
        readOnlyValue={ fields.firstName }
        isReadOnly={ isFormReadonly }
      >
        <input type="text" name="first-name" />
      </FormElementWrapper>
      <FormElementWrapper
        name="last-name"
        readOnlyValue={ fields.lastName }
        readOnlyPlaceholder="Add lastname"
        isReadOnly={ isFormReadonly }
      >
        <input type="text" name="last-name" />
      </FormElementWrapper>
      { !isFormReadonly && <button onClick={ setFormReadonly }>Cancel</button> }
    </div>
  )}
</SkedFormValidation>` }
          </pre>
        </div>
      </div>
    </>
  ))
  .add(
    'FormInputElement',
    () => {
      const selectType = select<string>(
        'Type',
        {
          radio: 'radio',
          checkbox: 'checkbox',
          text: 'text'
        },
        'text'
      )

      return (
        <div className="sk-flex">
          <FormInputElement
            id="input"
            type={ selectType }
            placeholder="A text field"
            inlineLabelOptional={ boolean('inlineLabelOptional', false) }
            inlineLabel={ (selectType === 'radio' || selectType === 'checkbox') && 'Radio and checkbox labels can be supplied via the inlineLabel prop' }
            disabled={ boolean('disabled', false) }
          />
        </div>
      )
    })
  .add(
    'FormElementWrapper',
    () => {
      return (
        <FormElementWrapper validation={ { isValid: boolean('isValid', true), error: 'Field is required' } } size={ select('Input Size', ['x-small', 'small', 'medium', 'large', 'x-large'], 'large') }>
          <input type="text" className="sked-input-textbox sked-form-element__outline" disabled={ boolean('Disabled', false) } />
        </FormElementWrapper>
      )
    })
  .add('FormLabel', () => <FormLabel optional={ boolean('Optional', false) }>I'm a form label</FormLabel>)
  .add('FormValidationCallout', () => <FormValidationCallout validation={ { isValid: boolean('isValid', false), error: 'Start needs to be before finish' } } />)
  .add(
    'SkedFormValidation',
    () => (
      <SkedFormValidation
        config={ {
          name: { isRequired: 'Name is required' },
          email: { isRequired: 'Email is required', isEmail: 'Wuh? Email is not valid' },
          coffee: {}
        } }
        onSubmit={ action('submit') }
        initialValues={ { coffee: 'yes' } }
      >
        { ({ isValidOnSubmit, isValidAfterModified, fields }) => {
          return (
            <div className="sk-mb-8">
              <div className="sk-flex sk-items-baseline">
                <FormLabel className="sk-w-1/2" id="name">
                  Name
                </FormLabel>
                <FormElementWrapper className="sk-mb-3" size="medium" validation={ isValidOnSubmit('name') }>
                  <FormInputElement className="sk-w-1/2" type="text" name="name" />
                </FormElementWrapper>
              </div>
              <div className="sk-flex ">
                <FormLabel className="sk-w-1/2" id="email">
                  Email <span className="sk-text-xxs">(this field will be validated on modified)</span>
                </FormLabel>
                <FormElementWrapper className="sk-mb-3" size="medium" validation={ isValidAfterModified('email') }>
                  <FormInputElement className="sk-w-1/2" type="text" name="email" />
                </FormElementWrapper>
              </div>
              <div className="sk-flex">
                <FormLabel className="sk-w-1/2">Drinks coffee</FormLabel>
                <div className="sk-flex sk-w-1/2">
                  <FormElementWrapper className="sk-mb-3" size="medium">
                    <FormInputElement id="drinkscoffee" className="sk-mr-5" type="radio" name="coffee" inlineLabel="Yes" value="yes" checked={ fields.coffee === 'yes' } />
                    <FormInputElement id="doesnotdrinkcoffee" type="radio" name="coffee" inlineLabel="No" value="no" checked={ fields.coffee === 'no' } />
                  </FormElementWrapper>
                </div>
              </div>
              <Button type="submit" className="sk-float-right" buttonType="primary">
                Save
              </Button>
            </div>
          )
        } }
      </SkedFormValidation>
    ))
  .add('ReadOnly', () => <ReadOnly value={ text('Value', 'Hover over me to see a disabled read only') } placeholderValue={ text('Custom placeholder', '') } name="disabled" locked={ boolean('locked', true) } />)
  .add(
    'Click to edit',
    () => (
      <div className="sk-w-1/2">
        <SkedFormValidation
          options={ { clickToEdit: true } }
          config={ {
            name: { isRequired: 'Name is required' },
            email: { isRequired: 'Email is required', isEmail: 'Wuh? Email is not valid' }
          } }
          onSubmit={ action('submit') }
          initialValues={ { name: 'Kevin Smith' } }
        >
          { ({ isValidOnSubmit, isValidAfterModified, isFormReadonly, resetFieldsToInitialValues, fields }) => (
            <div style={ gridLayout }>
              <FormLabel id="name">Name</FormLabel>
              <FormElementWrapper className="sk-mb-3" size="small" validation={ isValidOnSubmit('name') } isReadOnly={ isFormReadonly } name="name" readOnlyValue={ fields.name }>
                <FormInputElement value={ fields.name } type="text" name="name" placeholder="Name" />
              </FormElementWrapper>
              <FormLabel id="email">Email</FormLabel>
              <FormElementWrapper size="medium" validation={ isValidAfterModified('email') } readOnlyValue={ fields.email } isReadOnly={ isFormReadonly } name="email" readOnlyPlaceholder="Add email">
                <FormInputElement value={ fields.email } type="text" name="email" placeholder="Email" />
              </FormElementWrapper>
              { !isFormReadonly && (
                <div style={ { gridColumn: 2 } }>
                  <ButtonGroup className="sk-float-right sk-mt-6">
                    <Button buttonType="transparent" onClick={ resetFieldsToInitialValues }>
                      Cancel
                    </Button>
                    <Button type="submit" className="sk-float-right" buttonType="primary">
                      Save
                    </Button>
                  </ButtonGroup>
                </div>
              ) }
            </div>
          ) }
        </SkedFormValidation>
      </div>
    ))
