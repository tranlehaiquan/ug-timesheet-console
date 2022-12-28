import * as React from 'react'

import { PaginationCount } from './pagination-count/PaginationCount'
import { PaginationPages } from './pagination-pages/PaginationPages'
import { IProps } from './interfaces'

interface IState  {
  /**
   * current page in pagination
   */
  currentPage: number
}
export class Pagination extends React.PureComponent<IProps, IState> {
  state = {
    currentPage: this.props.currentPage
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.itemsPerPage !==  this.props.itemsPerPage ||
      prevProps.itemsTotal !== this.props.itemsTotal) {
      this.setState({ currentPage: 1 }, () => this.props.onPageChange(1))
    }
    if (prevProps.currentPage !== this.props.currentPage) {
      this.setState({ currentPage: this.props.currentPage }, () => this.props.onPageChange(this.props.currentPage))
    }
  }

  pageUpdateHandler = (pageNumber: number) => {
    this.setState(
      { currentPage: pageNumber },
      () => this.props.onPageChange(this.state.currentPage)
    )
  }

  render() {
    const { itemsTotal, itemsPerPage, truncateLimiter, currentPageDelta }  = this.props
    const { currentPage } = this.state

    return (
      <div
        className="sk-relative sk-w-full sk-h-10 sk-flex sk-items-center sk-justify-center sk-border-t sk-border-grey-light sk-leading-normal"
        data-sk-name="pagination-container"
      >
        <PaginationCount
          itemsPerPage={ itemsPerPage }
          itemsTotal={ itemsTotal }
          currentPage={ currentPage }
        />
        <PaginationPages
          itemsPerPage={ itemsPerPage }
          itemsTotal={ itemsTotal }
          currentPage={ currentPage }
          onPageChange={ this.pageUpdateHandler }
          truncateLimiter={ truncateLimiter }
          currentPageDelta={ currentPageDelta }
        />
      </div>
    )
  }
}
