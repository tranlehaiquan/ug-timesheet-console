import * as React from 'react'
import { noop } from 'lodash'
import { shallow, render } from 'enzyme'

import { BaseModal, ConfirmationModal } from './Modals'

describe('Modal', () => {
  describe('BaseModal', () => {
    test('renders', () => {
      const wrapper = shallow(<BaseModal>Some content</BaseModal>)
      expect(wrapper).toMatchSnapshot()
    })

    test('adds data-sk-name attibute', () => {
      const wrapper = shallow(<BaseModal>Some content</BaseModal>)
      expect(wrapper.find('[data-sk-name="sked-modal"]').length).toEqual(1)
    })
  })

  describe('ConfirmationModal', () => {
    test('renders', () => {
      const wrapper = shallow(<ConfirmationModal onCancel={ noop } onConfirm={ noop }>Some content</ConfirmationModal>)
      expect(wrapper).toMatchSnapshot()
    })

    test('adds data-sk-name attibutes', () => {
      const wrapper = shallow(<ConfirmationModal onCancel={ noop } onConfirm={ noop }>Some content</ConfirmationModal>)
      expect(wrapper.find('[data-sk-name="cancel-button"]').length).toEqual(1)
      expect(wrapper.find('[data-sk-name="confirm-button"]').length).toEqual(1)
    })

    test('calls confirm prop function', () => {
      const confirmSpy = jest.fn()
      const wrapper = shallow(<ConfirmationModal onCancel={ noop } onConfirm={ confirmSpy }>Some content</ConfirmationModal>)
      wrapper.find('[data-sk-name="confirm-button"]').simulate('click')
      expect(confirmSpy).toBeCalled()
    })

    test('calls cancel prop function', () => {
      const cancelSpy = jest.fn()
      const wrapper = shallow(<ConfirmationModal onCancel={ cancelSpy } onConfirm={ noop }>Some content</ConfirmationModal>)
      wrapper.find('[data-sk-name="cancel-button"]').simulate('click')
      expect(cancelSpy).toBeCalled()
    })

    test('calls confirm prop function with loading indicator', () => {
      const confirmSpy = jest.fn()
      const wrapper = shallow(<ConfirmationModal onCancel={ noop } onConfirm={ confirmSpy } useWorkingStateOnConfirm>Some content</ConfirmationModal>)
      wrapper.find('[data-sk-name="confirm-button"]').simulate('click')
      expect(confirmSpy).toBeCalled()
      expect(wrapper.state('confirmActionLoading')).toEqual(true)
    })

    test('uses supplied confirm button text', () => {
      const wrapper = shallow(<ConfirmationModal onCancel={ noop } onConfirm={ noop }  confirmButtonText="I work">Some content</ConfirmationModal>)
      expect(wrapper.find('[data-sk-name="confirm-button"]').dive().text()).toEqual('I work<LoadingSpinner />')
    })
  })
})
