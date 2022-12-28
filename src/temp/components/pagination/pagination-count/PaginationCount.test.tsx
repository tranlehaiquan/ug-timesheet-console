import * as React from 'react'
import { mount } from 'enzyme'

import { PaginationCount } from './PaginationCount'

describe('PaginationCount', () => {
  it('renders Pagination details', () => {
    const itemsPerPage = 10
    const itemsTotal = 100
    const currentPage = 1

    const wrapper = mount(
      <PaginationCount
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
      />
    )
    const PaginationCountText = wrapper.find('[data-sk-name="pagination-count-container"]').getDOMNode().innerHTML

    expect(wrapper.find(PaginationCount).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-count-container"]').length).toBe(1)

    const paginationText = `${(currentPage - 1) * itemsPerPage + 1}-${currentPage * itemsPerPage} of ${itemsTotal}`
    expect(PaginationCountText).toBe(paginationText)
  })

  it('renders Pagination details for one item per page', () => {
    const itemsPerPage = 1
    const itemsTotal = 100
    const currentPage = 1

    const wrapper = mount(
      <PaginationCount
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
      />
    )
    const PaginationCountText = wrapper.find('[data-sk-name="pagination-count-container"]').getDOMNode().innerHTML

    expect(wrapper.find(PaginationCount).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-count-container"]').length).toBe(1)

    const paginationText = `${(currentPage - 1) * itemsPerPage + 1} of ${itemsTotal}`
    expect(PaginationCountText).toBe(paginationText)
  })

  it('renders Pagination details for last page', () => {
    const itemsPerPage = 10
    const itemsTotal = 95
    const currentPage = Math.ceil(itemsTotal / itemsPerPage)

    const wrapper = mount(
      <PaginationCount
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
      />
    )
    const PaginationCountText = wrapper.find('[data-sk-name="pagination-count-container"]').getDOMNode().innerHTML

    expect(wrapper.find(PaginationCount).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-count-container"]').length).toBe(1)

    const paginationText = `${(currentPage - 1) * itemsPerPage + 1}-${itemsTotal} of ${itemsTotal}`
    expect(PaginationCountText).toBe(paginationText)
  })

  it('renders Pagination details for less items than are displayed per one page', () => {
    const itemsPerPage = 10
    const itemsTotal = 1
    const currentPage = Math.ceil(itemsTotal / itemsPerPage)

    const wrapper = mount(
      <PaginationCount
        itemsPerPage={ itemsPerPage }
        itemsTotal={ itemsTotal }
        currentPage={ currentPage }
      />
    )
    const PaginationCountText = wrapper.find('[data-sk-name="pagination-count-container"]').getDOMNode().innerHTML

    expect(wrapper.find(PaginationCount).length).toBe(1)
    expect(wrapper.find('[data-sk-name="pagination-count-container"]').length).toBe(1)

    const paginationText = `${itemsTotal} of ${itemsTotal}`
    expect(PaginationCountText).toBe(paginationText)
  })
})
