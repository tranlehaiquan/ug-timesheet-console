import * as React from 'react'
import classnames from 'classnames'

import { ReadOnly } from './ReadOnly'

interface InputFormValidationProps {
  inlineLabel?: string | JSX.Element
  inlineLabelOptional?: boolean
  inlineLabelClassName?: string
  inputRef?: React.Ref<HTMLInputElement>
}

type InputSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'full'

interface FormElementWrapperProps {
  readOnlyValue?: string
  isReadOnly?: boolean
  readOnlyPlaceholder?: string
  name?: string
  locked?: boolean
  size?: InputSize
}

export interface ValidationProps { validation?: { isValid?: boolean, error?: string | null } }

type FormElementProps = InputFormValidationProps & React.InputHTMLAttributes<HTMLInputElement>

const FormField: React.FunctionComponent<ValidationProps & React.HTMLAttributes<HTMLDivElement>> = ({ validation, className, children, ...otherProps }) => {
  return (
    <div className={ classnames(className, 'sked-form-element', { 'sked-form-element--invalid': validation && !validation.isValid }) } { ...otherProps }>
      { children }
    </div>
  )
}

const ShowErrorIfInvalid = (validation: ValidationProps['validation']) => {
  if (validation && !validation.isValid && validation.error) {
    return (<div className="sked-form-element__errors" data-sk-name="form-error-text">{ validation.error }</div>)
  }
  return null
}

/**
 * Standard form inputs should be created using FormElement. It is responsible for creating the type of input you need as well as
 * displaying validation errors. Radio’s and Checkboxes can utilise the inlineLabel prop to show a label inline with the input.
 * The id of the input will be used as the ‘for’ attribute on the label for accessibility.
 */
export class FormInputElement extends React.PureComponent<FormElementProps, {}> {
  private _inputClassNames = (className: string) => {
    switch (className) {
      case 'radio': return 'sked-radio'
      case 'checkbox': return 'sked-checkbox'
      default: return null
    }
  }

  isOfTextType = () => this.props.type !== 'radio' && this.props.type !== 'checkbox'

  withInlineLabel = (inputComponent: React.ReactElement, props: FormElementProps) => {
    const { id, disabled, inlineLabel, inlineLabelOptional, inlineLabelClassName } = props

    return (
      <div className="sk-flex sk-items-center">
        { inputComponent }
        <FormLabel
          optional={ !!inlineLabelOptional }
          htmlFor={ id }
          inline
          className={ classnames({ 'sk-cursor-default': disabled, 'sk-cursor-pointer': !disabled }, inlineLabelClassName) }
        >
          { inlineLabel }
        </FormLabel>
      </div>
    )
  }

  render() {
    const { className, inputRef, type, inlineLabel, inlineLabelClassName, ...rest } = this.props
    const inputClasses = classnames({ 'sked-input-textbox sked-form-element__outline': this.isOfTextType() }, this._inputClassNames(type), className)
    const inputComponent = React.createElement('input', { type, className: inputClasses, ref: inputRef, ...rest })

    return inlineLabel ? this.withInlineLabel(inputComponent, this.props) : inputComponent
  }
}

/**
 * Will render a form label and apply ‘required’ styling if required
 */
export const FormLabel: React.FunctionComponent<{ optional?: boolean, inline?: boolean } & React.LabelHTMLAttributes<HTMLLabelElement>> = props => {
  const { optional, inline, children, className, ...labelProps } = props
  const classes = classnames(
    'sk-text-sm sk-font-normal sk-leading-tight',
    {
      'sk-ml-2 sk-inline sk-text-navy': inline,
      'sk-text-navy-lighter': !inline
    },
    className
  )

  return (
    <label className={ classes } { ...labelProps }>
      { children }
      { optional && <span data-sk-name="optional"> (optional)</span> }
    </label>
  )
}

FormLabel.displayName = 'FormLabel'

/**
 *  FormElementWrapper should be used to wrap custom input components (such as Autocomplete). It will ensure that errors
 *  are displayed in a consistent fashion. The resulting input will need to have the class form-element__outline applied
 *  to it for us to hook into it to apply appropriate styling.
 */
export const FormElementWrapper: React.SFC<FormElementWrapperProps & ValidationProps & React.HTMLAttributes<HTMLDivElement>> = ({
  validation,
  children,
  isReadOnly,
  readOnlyValue,
  name,
  size,
  locked,
  className,
  readOnlyPlaceholder,
  ...otherProps
}) => {
  const inputSizes = {
    'x-small': 'sked-form-element-wrapper-x-small',
    small: 'sked-form-element-wrapper-small',
    medium: 'sked-form-element-wrapper-medium',
    large: 'sked-form-element-wrapper-large',
    'x-large': 'sked-form-element-wrapper-x-large',
    full: 'sked-form-element-wrapper-full'
  }

  return (
    <div className={ className } { ...otherProps }>
      <div className={ inputSizes[size || 'full'] }>
        { isReadOnly ? <ReadOnly placeholderValue={ readOnlyPlaceholder } value={ readOnlyValue } name={ name } locked={ locked } /> : <FormField validation={ validation }>{ children }</FormField> }
      </div>
      { ShowErrorIfInvalid(validation) }
    </div>
  )
}

/**
 * Use when a validation error isn’t tied to a particular field
 */
export const FormValidationCallout: React.FunctionComponent<ValidationProps & React.HTMLAttributes<HTMLDivElement>> = ({ validation, className, ...otherProps }) => {
  const classNames = classnames('sked-error-callout', className)

  if (!validation.isValid && validation.error) {
    return (
      <div className={ classNames } { ...otherProps } data-sk-name="callout-error">
        { validation.error }
      </div>
    )
  }

  return null
}
