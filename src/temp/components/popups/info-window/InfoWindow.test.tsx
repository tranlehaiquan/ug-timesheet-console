import * as React from 'react'
import { shallow, mount } from 'enzyme'

import { InfoWindow } from './InfoWindow'
import * as InfoWindowPositionUtilsModule from './info-window-utils'

describe('InfoWindow', () => {
  afterEach(() => {
    // Remove the document artifacts
    if (document.getElementsByClassName('sked-infowindow').length) {
      document.body.removeChild(document.getElementsByClassName('sked-infowindow')[0])
    }
  })
  test('renders the trigger', () => {
    const wrapper = shallow(
      <InfoWindow content={ <span /> } position={ 'top' } event={ 'click' }>
        <span className="trigger" />
      </InfoWindow>
    )
    expect(wrapper.find('.trigger').length).toEqual(1)
  })

  test('renders the content on click', () => {
    const wrapper = mount(
      <InfoWindow content={ <span className="first" /> } position={ 'top' } event={ 'click' }>
        <span className="trigger" />
      </InfoWindow>
    )

    wrapper.find('.trigger').simulate('click')

    expect(document.getElementsByClassName('sked-infowindow').length).toEqual(1)
  })

  it('renders the content on hover', () => {
    const wrapper = mount(
      <InfoWindow content={ <span /> } position={ 'top' } event={ 'hover' }>
        <span className="trigger" />
      </InfoWindow>
    )

    wrapper.find('.sked-infowindow__trigger').simulate('mouseOver')
    expect(document.getElementsByClassName('sked-infowindow').length).toEqual(1)

    wrapper.find('.sked-infowindow__trigger').simulate('mouseLeave')
    expect(document.getElementsByClassName('sked-infowindow').length).toEqual(0)
  })

  it('renders the content on mount', () => {
    // Act
    const wrapper = mount(
      <InfoWindow content={ <span /> } position={ 'top' } event={ 'mount' }>
        <span className="trigger" />
      </InfoWindow>
    )

    // Assert
    expect(document.getElementsByClassName('sked-infowindow').length).toEqual(1)

    // Cleanup
    wrapper.unmount()
  })

  it('calls onClose when the window is closed', () => {
    // Arrange
    const event = {} as MouseEvent
    const onCloseSpy = jest.fn()

    // Act
    const wrapper = mount(
      <InfoWindow
        content={ <span /> }
        position={ 'top' }
        event={ 'mount' }
        onClose={ onCloseSpy }
      >
        <span className="trigger" />
      </InfoWindow>
    )
    const instance = wrapper.instance() as InfoWindow
    instance.handleBodyClick(event)

    // Assert
    expect(document.getElementsByClassName('sked-infowindow').length).toEqual(0)
    expect(onCloseSpy).toBeCalled

    // Cleanup
    wrapper.unmount()
  })

  describe('delayShow', () => {
    let attachEventListenersSpy: jest.SpyInstance

    beforeEach(() => {
      attachEventListenersSpy = jest.spyOn(InfoWindow.prototype, 'attachEventListeners')
    })

    afterEach(() => {
      attachEventListenersSpy.mockRestore()
    })

    it('renders content after a delay', (done: () => void) => {
      const wrapper = mount(
        <InfoWindow content={ <span className="first" /> } position={ 'top' } event={ 'click' } delayShow={ 15 }>
          <span className="trigger" />
        </InfoWindow>
      )

      wrapper.find('.trigger').simulate('click')

      expect(document.getElementsByClassName('sked-infowindow').length).toEqual(0)
      setTimeout(() => {
        expect(document.getElementsByClassName('sked-infowindow').length).toEqual(1)
        done()
      }, 20)
    })

    it('renders content after a delay but will close immediately', (done: () => void) => {
      const wrapper = mount(
        <InfoWindow content={ <span className="first" /> } position={ 'top' } event={ 'hover' } delayShow={ 15 }>
          <span className="trigger" />
        </InfoWindow>
      )

      wrapper.simulate('mouseOver')

      expect(document.getElementsByClassName('sked-infowindow').length).toEqual(0)
      setTimeout(() => {
        expect(document.getElementsByClassName('sked-infowindow').length).toEqual(1)
        wrapper.simulate('mouseLeave')

        // Assert
        setImmediate(() => {
          expect(document.getElementsByClassName('sked-infowindow').length).toEqual(0)
          done()
        })
      }, 20)
    })

    it('attaches event listeners after a delay', (done: () => void) => {
      const wrapper = mount(
        <InfoWindow content={ <span className="first" /> } position={ 'top' } event={ 'click' } delayShow={ 15 }>
          <span className="trigger" />
        </InfoWindow>
      )

      wrapper.find('.trigger').simulate('click')

      expect(attachEventListenersSpy).not.toBeCalled()
      setTimeout(() => {
        expect(attachEventListenersSpy).toBeCalled()
        done()
      }, 20)
    })

    it('doesnt attach event listener if the infowindow is closed during the delay', (done: () => void) => {
      const wrapper = mount(
        <InfoWindow content={ <span className="first" /> } position={ 'top' } event={ 'hover' } delayShow={ 15 }>
          <span className="trigger" />
        </InfoWindow>
      )

      wrapper.simulate('mouseOver')
      wrapper.simulate('mouseLeave')

      expect(attachEventListenersSpy).not.toBeCalled()
      setTimeout(() => {
        expect(attachEventListenersSpy).not.toBeCalled()
        done()
      }, 20)
    })
  })

  describe('getDisplayPosition', () => {
    it('updates trigger rectangle based on window scroll', () => {
      // Arrange
      const getPositionScoresSpy = jest.spyOn(InfoWindowPositionUtilsModule, 'getPositionScores')
      // Fake a scroll
      // @ts-ignore: Cannot assign because it is a constant or a read-only property.
      window.innerWidth = 75
      // @ts-ignore: Cannot assign because it is a constant or a read-only property.
      window.innerHeight = 40
      // @ts-ignore: Cannot assign because it is a constant or a read-only property.
      window.scrollX = 50
      // @ts-ignore: Cannot assign because it is a constant or a read-only property.
      window.scrollY = 20

      // Act
      const wrapper = mount(
        <InfoWindow content={ <span /> } position={ 'top' } event={ 'mount' }>
          <span className="trigger" />
        </InfoWindow>
      )

      // Assert
      expect(document.getElementsByClassName('sked-infowindow').length).toEqual(1)
      expect(getPositionScoresSpy).toHaveBeenCalledWith(
        expect.anything(),          // trigger point
        expect.objectContaining({
          left: window.scrollX,
          top: window.scrollY
        }),                        // trigger rect
        expect.anything(),          // content rect
        expect.anything(),          // triangle rect
        expect.objectContaining({
          left: window.scrollX,
          top: window.scrollY,
          right: window.scrollX + window.innerWidth,
          bottom: window.scrollY + window.innerHeight
        }),                         // window rect,
        undefined,
        undefined
      )

      // Cleanup
      wrapper.unmount()
    })
  })
})
