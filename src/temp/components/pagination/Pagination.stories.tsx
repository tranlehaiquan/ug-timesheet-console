import * as React from "react";
import { storiesOf } from "@storybook/react";
import { number } from "@storybook/addon-knobs/react";
import { action } from "@storybook/addon-actions";

import { Pagination } from "./Pagination";

storiesOf("Pagination", module).add("Pagination", () => {
  const itemsPerPage = number("Items per page", 10);
  const itemsTotal = number("Items total", 70);
  const currentPage = number("Page current", 1);

  return (
    <Pagination
      itemsPerPage={itemsPerPage}
      itemsTotal={itemsTotal}
      currentPage={currentPage}
      onPageChange={action("page changed")}
      truncateLimiter={number("Truncate Limiter", 7)}
      currentPageDelta={number("Current Page Delta", 1)}
    />
  );
});
