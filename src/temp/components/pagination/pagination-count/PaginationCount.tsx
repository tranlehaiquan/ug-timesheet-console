import * as React from "react";

import { IProps } from "../interfaces";

export const PaginationCount: React.FC<IProps> = React.memo((props) => {
  const itemsTotal = props.itemsTotal < 1 || null ? 1 : props.itemsTotal;
  const itemsPerPage = props.itemsPerPage < 1 || null ? 1 : props.itemsPerPage;
  const currentPage = props.currentPage < 1 || null ? 1 : props.currentPage;
  return (
    <div
      className={
        "sked-pagination-count-min-w sk-flex-grow-0 sk-flex sk-items-center sk-ml-6 sk-text-sm sk-text-navy-light"
      }
      data-sk-name="pagination-count-container"
    >
      {getItemsSpan(itemsPerPage, itemsTotal, currentPage)}
    </div>
  );
});

const getItemsSpan = (
  itemsPerPage: number,
  itemsTotal: number,
  currentPage: number
) => {
  const totalPages = Math.ceil(itemsTotal / itemsPerPage);
  if (itemsTotal <= itemsPerPage) {
    return `${itemsTotal} of ${itemsTotal}`;
  }
  const itemsSpanStart = (currentPage - 1) * itemsPerPage + 1;
  const itemsSpanEnd =
    currentPage !== totalPages ? currentPage * itemsPerPage : itemsTotal;
  const itemsSpan =
    itemsSpanStart === itemsSpanEnd
      ? itemsSpanStart
      : `${itemsSpanStart}-${itemsSpanEnd}`;
  return `${itemsSpan} of ${itemsTotal}`;
};
