import * as React from 'react'
import { mount } from 'enzyme'

import { PaginationPages } from './PaginationPages'

describe('PaginationPages', () => {
  it('renders Pagination pages elements without truncated items', () => {
    const itemsPerPage = 10
    const itemsTotal = 70
    const currentPage = 1
    const onPageChange = jest.fn()

    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number"]').length).toBe(6)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number-current"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-truncated"]').length).toBe(0)
  })

  it('renders Pagination pages elements with truncated items', () => {
    const itemsPerPage = 10
    const itemsTotal = 1000
    const currentPage = 50
    const onPageChange = jest.fn()

    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number"]').length).toBe(4)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-truncated"]').length).toBe(2)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number-current"]').length).toBe(1)
  })

  it('renders Pagination pages elements with truncated items and current in first 5 pages', () => {
    const itemsPerPage = 10
    const itemsTotal = 1000
    const currentPage = 5
    const onPageChange = jest.fn()

    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number"]').length).toBe(5)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-truncated"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number-current"]').length).toBe(1)
  })

  it('renders Pagination pages elements with truncated items and current page in last 5 pages', () => {
    const itemsPerPage = 10
    const itemsTotal = 1000
    const currentPage = 96
    const onPageChange = jest.fn()

    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number"]').length).toBe(5)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-truncated"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number-current"]').length).toBe(1)
  })

  it('disables back arrow when current page is set as first', () => {
    const itemsPerPage = 10
    const itemsTotal = 30
    const currentPage = 1
    const onPageChange = jest.fn()

    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').hasClass('sk-cursor-not-allowed')).toBe(true)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').hasClass('sk-cursor-not-allowed')).toBe(false)
  })

  it('disables forward arrow when current page is set as last', () => {
    const itemsPerPage = 10
    const itemsTotal = 30
    const currentPage = 3
    const onPageChange = jest.fn()

    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').hasClass('sk-cursor-not-allowed')).toBe(false)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').hasClass('sk-cursor-not-allowed')).toBe(true)
  })

  it('disables arrows when there is only one page', () => {
    const itemsPerPage = 10
    const itemsTotal = 10
    const currentPage = 1
    const onPageChange = jest.fn()

    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number-current"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').hasClass('sk-cursor-not-allowed')).toBe(true)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').hasClass('sk-cursor-not-allowed')).toBe(true)
  })

  it('renders empty pagination when props are set to 0', () => {
    const onPageChange = jest.fn()
    const wrapper = mount(
      <PaginationPages
        itemsPerPage={ 1 }
        itemsTotal={ 0 }
        currentPage={ 0 }
        onPageChange={ onPageChange }
      />
    )

    expect(wrapper.find(PaginationPages).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-container"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number-current"]').length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-number"]').length).toBe(0)
    expect(wrapper.find('[data-sk-name="pagination-pages-item-truncated"]').length).toBe(0)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-left"]').hasClass('sk-cursor-not-allowed')).toBe(true)
    expect(wrapper.find('[data-sk-name="pagination-pages-arrow-right"]').hasClass('sk-cursor-not-allowed')).toBe(true)
  })
})
