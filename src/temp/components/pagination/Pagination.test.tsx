import * as React from 'react'
import { mount } from 'enzyme'

import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('changes Pagination state value of currentPage', () => {
    const itemsPerPage = 10
    const itemsTotal = 30
    const currentPage = 1
    const onPageChange = jest.fn()

    const wrapper = mount(
      <Pagination
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )
    const instance = wrapper.instance() as Pagination

    expect(wrapper.find(Pagination).length).toBe(1)
    expect(wrapper.state('currentPage')).toEqual(currentPage)

    instance.pageUpdateHandler(currentPage + 1)
    expect(wrapper.state('currentPage')).toEqual(currentPage + 1)
  })

  it('changes Pagination state value when clicking arrows', () => {
    const itemsPerPage = 10
    const itemsTotal = 30
    const currentPage = 1
    const onPageChange = jest.fn()

    const wrapper = mount(
      <Pagination
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(Pagination).length).toBe(1)
    expect(wrapper.state('currentPage')).toEqual(1)

    wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').at(0).simulate('click')
    expect(wrapper.state('currentPage')).toEqual(2)

    wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').at(0).simulate('click')
    expect(wrapper.state('currentPage')).toEqual(3)

    wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').at(0).simulate('click')
    expect(wrapper.state('currentPage')).toEqual(2)

    wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').at(0).simulate('click')
    expect(wrapper.state('currentPage')).toEqual(1)
  })

  it('truncated item/disabled arrow click does not update state', () => {
    const itemsPerPage = 10
    const itemsTotal = 100
    const currentPage = 1
    const onPageChange = jest.fn()

    const wrapper = mount(
      <Pagination
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(Pagination).length).toBe(1)
    expect(wrapper.state('currentPage')).toEqual(1)

    wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').at(0).simulate('click')
    expect(wrapper.state('currentPage')).toEqual(1)

    wrapper.find('[data-sk-name="pagination-pages-item-truncated"]').at(0).simulate('click')
    expect(wrapper.state('currentPage')).toEqual(1)
  })

  it('sets current page to first after itemsPerPage prop change', () => {
    const wrapper = mount(
      <Pagination
        itemsPerPage={ 10 }
        itemsTotal={ 1000 }
        currentPage={ 50 }
        onPageChange={ jest.fn() }
      />
    )

    expect(wrapper.state('currentPage')).toEqual(50)

    wrapper.setProps({ itemsPerPage: 5 })
    expect(wrapper.state('currentPage')).toEqual(1)
  })

  it('sets current page to first after itemsTotal prop change', () => {
    const wrapper = mount(
      <Pagination
        itemsPerPage={ 10 }
        itemsTotal={ 1000 }
        currentPage={ 50 }
        onPageChange={ jest.fn() }
      />
    )

    expect(wrapper.state('currentPage')).toEqual(50)

    wrapper.setProps({ itemsTotal: 500 })
    expect(wrapper.state('currentPage')).toEqual(1)
  })
})
