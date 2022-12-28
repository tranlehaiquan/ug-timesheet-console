import * as React from 'react'
import classnames from 'classnames'
import { range } from 'lodash'

import { Icon } from '../../icon/Icon'
import { IProps } from '../interfaces'

export const PaginationPages: React.SFC<IProps> = props => {
  const { onPageChange } = props
  const currentPage = props.currentPage < 1 || null ? 1 : props.currentPage
  const itemsTotal = props.itemsTotal < 1 || null ? 1 : props.itemsTotal
  const itemsPerPage = props.itemsPerPage < 1 || null ? 1 : props.itemsPerPage
  const totalPages = Math.ceil(itemsTotal / itemsPerPage)
  const truncateLimiter = props.truncateLimiter < 1 || null ? 1 : props.truncateLimiter
  const currentPageDelta = props.currentPageDelta < 1 || null ? 1 : props.currentPageDelta
  const getPages = renderPaginationItems(itemsTotal, itemsPerPage, currentPage, currentPageDelta, truncateLimiter)

  const backHandler = () => currentPage > 1 ? onPageChange(currentPage - 1) : null
  const forwardHandler = () => currentPage < totalPages ? onPageChange(currentPage + 1) : null
  const changeHandler = (newPage: number) => (event: React.MouseEvent) => newPage !== currentPage ? onPageChange(newPage) : null

  return (
    <div
      className="sk-flex-grow sk-flex sk-items-center sk-justify-center sk-text-navy-light"
      data-sk-name="pagination-pages-container"
    >
      <div
        className={ classnames(
          'sked-pagination-item-min-w sk-w-auto sk-h-6 sk-px-2 sk-flex sk-items-center sk-justify-center sk-rounded sk-select-none sk-text-sm sk-leading-normal sk-cursor-pointer hover:sk-bg-grey-lightest',
          { 'sk-text-grey-light sk-cursor-not-allowed sk-bg-white hover:sk-bg-white': currentPage === 1 || totalPages === 0 }
        ) }
        onClick={ backHandler }
        data-sk-name="pagination-pages-arrow-left"
      >
        <Icon
          name="chevronLeft"
          size={ 9 }
        />
      </div>
      {
        getPages.map((page, index) => (
          page !== '...' ? (
            <div
              className={ classnames(
                'sked-pagination-item-min-w sk-w-auto sk-h-6 sk-px-2 sk-flex sk-items-center sk-justify-center sk-rounded sk-cursor-pointer sk-select-none sk-text-sm sk-leading-normal hover:sk-bg-grey-lightest',
                { 'sk-bg-navy-lighter sk-text-white hover:sk-bg-navy-lighter sk-text-white': page === currentPage },
                { 'sk-tracking-wide': page > 9 }
              ) }
              key={ index }
              onClick={ changeHandler(page as number) }
              data-sk-name={ page === currentPage ? 'pagination-pages-item-number-current' : 'pagination-pages-item-number' }
            >
              { page }
            </div>
          ) : (
              <div
                className={ 'sked-pagination-item-min-w sk-w-auto sk-h-6 sk-px-2 sk-flex sk-items-center sk-justify-center sk-rounded sk-cursor-default sk-select-none sk-text-sm sk-leading-normal' }
                key={ index }
                data-sk-name="pagination-pages-item-truncated"
              >
                { page }
              </div>
            )
        ))
      }
      <div
        className={ classnames(
          'sked-pagination-item-min-w sk-w-auto sk-h-6 sk-px-2 sk-flex sk-items-center sk-justify-center sk-rounded sk-select-none sk-text-sm sk-leading-normal sk-cursor-pointer hover:sk-bg-grey-lightest',
          { 'sk-text-grey-light sk-cursor-not-allowed sk-bg-white hover:sk-bg-white': currentPage === totalPages || totalPages === 0 }
        ) }
        onClick={ forwardHandler }
        data-sk-name="pagination-pages-arrow-right"
      >
        <Icon
          name="chevronRight"
          size={ 9 }
        />
      </div>
    </div>
  )
}

const renderPaginationItems = (
  itemsTotal: number,
  itemsPerPage: number,
  currentPage: number,
  currentPageDelta: number = 1,
  truncateLimiter: number = 7
) => {
  const totalPages = Math.ceil(itemsTotal / itemsPerPage)
  const checkedTruncateLimiter = Math.max(7, truncateLimiter)

  if (totalPages <= checkedTruncateLimiter) {
    return range(1, totalPages + 1)
  }
  return generatePaginationItems(currentPage, totalPages, currentPageDelta)
}

const generatePaginationItems = (currentPage: number, lastPage: number, currentPageDelta: number) => {
  const delta = currentPageDelta + 7 > lastPage ? 1 : currentPageDelta
  const range = []

  if (currentPage <  5 + delta) {
    for (let i = 1; i < 5 + delta; i += 1) {
      range.push(i)
    }
    range.push('...')
    range.push(lastPage)
  } else if ((lastPage - currentPage) < 5 + delta) {
    range.push(1)
    range.push('...')
    for (let i = lastPage - 3 - delta; i <= lastPage; i += 1) {
      range.push(i)
    }
  } else {
    for (let i = Math.max(2, (currentPage - delta)); i <= Math.min((lastPage - 1), (currentPage + delta)); i += 1) {
      range.push(i)
    }
    if ((currentPage - delta) > 2) {
      range.unshift('...')
    }
    if ((currentPage + delta) < (lastPage - delta)) {
      range.push('...')
    }
    range.unshift(1)
    if (lastPage !== 1) range.push(lastPage)
  }
  return range
}
