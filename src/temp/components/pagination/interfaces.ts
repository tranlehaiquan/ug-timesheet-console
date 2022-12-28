export interface IProps {
  /**
   * number of all items
   */
  itemsTotal: number;
  /**
   * number of items on one page
   */
  itemsPerPage: number;
  /**
   * current page in pagination
   */
  currentPage: number;
  /**
   * optional value for number of pages displayed before/after current page item @default 1
   */
  currentPageDelta?: number;
  /**
   * optional value for number of pages displayed without truncating page items @default 7
   */
  truncateLimiter?: number;
  /**
   *  function returning page number changed in pagination
   */
  onPageChange?: (pageNumber: number) => void;
}
