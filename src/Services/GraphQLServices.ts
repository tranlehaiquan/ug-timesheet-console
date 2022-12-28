import axios from "axios";
import flatMap from "lodash/fp/flatMap";
import zip from "lodash/fp/zip";
import { Subject, animationFrameScheduler } from "rxjs";
import { bufferTime } from "rxjs/operators";
import { trim, toNumber } from "lodash/fp";
import { isArray } from "lodash";
import { credentials } from "./Services";
import { toastMessage } from "../common/utils/notificationUtils";

const isSalesforce =
  credentials && credentials.vendor
    ? credentials.vendor.type === "salesforce"
    : false;

interface GraphqlResponse<T extends object = object> {
  data: T;
  errors?: object[];
}

interface GraphQlResolveFn<T extends object = object> {
  (response: GraphqlResponse<T>): void;
}

interface GraphQlRequest<T extends object = object> {
  resolve: GraphQlResolveFn<T>;
  request: {
    query: string;
    variables?: object;
  };
}

const graphQlRequest$ = new Subject<GraphQlRequest>();

graphQlRequest$
  .pipe(bufferTime(0, animationFrameScheduler))
  .subscribe(async (data) => {
    if (!data.length) {
      return;
    }
    const requests = data.map(({ request }) => request);
    const resolves = data.map(({ resolve }) => resolve);
    try {
      const { data: responses } = await httpApi.post<GraphqlResponse[]>(
        "/graphql/graphql/batch",
        requests
      );

      zip(resolves, responses).forEach(([resolve, response]) => {
        resolve(response);
      });
    } catch (errs) {
      if (errs) {
        const messages = isArray(errs)
          ? (errs as { message: string }[])
              .map((err: { message: string }) => err.message)
              .join(", ")
          : (errs as Error).message;
        toastMessage.error(messages);
      }
    }
  });

const makeGraphQlRequest = (query: string, variables?: object) =>
  new Promise<GraphqlResponse>((resolve) => {
    graphQlRequest$.next({
      resolve,
      request: {
        query,
        variables,
      },
    });
  });

const MAX_PAGE_SIZE = 200;
interface PaginationVariableKey {
  orderBy: string;
  offset: string;
  first: string;
  filter: string;
}

const httpApi = axios.create({
  baseURL: credentials.apiServer,
  headers: {
    Authorization: `Bearer ${credentials.apiAccessToken}`,
  },
});

interface FetchOnePageResp<T> {
  totalCount: number;
  data: T[];
}
interface OnePageGraphQlResponse<T> {
  [key: string]: {
    totalCount: number;
    edges: {
      node: T;
    }[];
  };
}

export const fetchOnePage = async <T>(
  query: string,
  responseKey: string,
  variables?: object
): Promise<FetchOnePageResp<T>> => {
  const { data: graphQlData, errors } = (await makeGraphQlRequest(
    query,
    variables
  )) as GraphqlResponse<OnePageGraphQlResponse<T>>;

  if (errors) {
    throw errors;
  }

  const {
    [responseKey]: { totalCount = 0, edges: data = [] },
  } = graphQlData;

  return {
    totalCount,
    data: data.map(({ node }) => node),
  };
};

const MAX_RECORD_LOAD_PER_BATCH = isSalesforce
  ? 2000
  : Number.POSITIVE_INFINITY;

const graphQlOrderByUIDBacthRequest = async <
  T extends HasUID,
  K extends keyof T = keyof T
>(
  query: string,
  responseKey: string,
  variables: Record<string, string> = {},
  orderBy: K[],
  paginationVariableKey: PaginationVariableKey,
  remainingRecords: number,
  fromItem: T
) => {
  const filterKey = paginationVariableKey
    ? paginationVariableKey.filter
    : "filter";
  const offsetKey = paginationVariableKey
    ? paginationVariableKey.offset
    : "offset";
  const orderByKey = paginationVariableKey
    ? paginationVariableKey.orderBy
    : "orderBy";
  const curentFilterValue = trim(variables[filterKey] || "");
  const fromItemFilter = orderBy.reduce<{
    filter: string[];
    equalFilter: string;
  }>(
    (previous, key) => {
      const lastNodeValue = `${JSON.stringify(fromItem[key])}`;

      if (!previous.equalFilter) {
        return {
          filter: [`${key} > ${lastNodeValue}`],
          equalFilter: `${key} == ${lastNodeValue}`,
        };
      }
      return {
        filter: [
          ...previous.filter,
          [previous.equalFilter, `${key} > ${lastNodeValue}`].join(" AND "),
        ],
        equalFilter: [previous.equalFilter, `${key} == ${lastNodeValue}`].join(
          " AND "
        ),
      };
    },
    {
      filter: [],
      equalFilter: "",
    }
  );
  const appendFilterValue = [
    fromItemFilter.filter.map((val) => `(${val})`).join(" OR ") ||
      `UID > ${JSON.stringify(fromItem.UID)}`,
    curentFilterValue,
  ]
    .filter((val) => !!val)
    .map((val) => `(${val})`)
    .join(" AND ");
  const maxRecordLoad = Math.min(remainingRecords, MAX_RECORD_LOAD_PER_BATCH);
  const numberOfPage = Math.ceil(maxRecordLoad / MAX_PAGE_SIZE);

  return flatMap(
    ({ data }) => data,
    await Promise.all(
      [...new Array(numberOfPage)].map((item, index) =>
        fetchOnePage<T>(query, responseKey, {
          ...variables,
          [filterKey]: appendFilterValue,
          [offsetKey]: index * MAX_PAGE_SIZE,
          [orderByKey]: orderBy.join(",") || "UID",
        })
      )
    )
  );
};

interface HasUID {
  UID: string;
}

const getLastUID = <T extends HasUID>(data: T[]) => data.slice(-1)[0];
const getNextBatchData = <T extends HasUID>(
  previousRemainingRecords: number,
  data: T[]
) => ({
  remainingRecords: previousRemainingRecords - data.length,
  fromUID: getLastUID(data),
});

export const autoPaginationGraphqlForSalesforce = async <
  T extends HasUID,
  K extends keyof T = keyof T
>(
  query: string,
  responseKey: string,
  variables: Record<string, string> = {},
  orderBy: K[],
  paginationVariableKey?: PaginationVariableKey
) => {
  const firstKey = paginationVariableKey
    ? paginationVariableKey.first
    : "first";
  const offsetKey = paginationVariableKey
    ? paginationVariableKey.offset
    : "offset";
  const orderByKey = paginationVariableKey
    ? paginationVariableKey.orderBy
    : "orderBy";

  let resultData: T[] = [];
  const { totalCount, data: firstPageDatas } = await fetchOnePage<T>(
    query,
    responseKey,
    {
      ...variables,
      // this solution will force use to overide these key
      [offsetKey]: 0,
      [orderByKey]: orderBy.join(",") || "UID",
      [firstKey]: MAX_PAGE_SIZE,
    }
  );

  if (totalCount === undefined) {
    throw new Error("missing total count in query");
  }
  let { remainingRecords, fromUID } = getNextBatchData(
    totalCount,
    firstPageDatas
  );
  resultData = firstPageDatas;

  while (remainingRecords > 0 && fromUID) {
    // eslint-disable-next-line no-await-in-loop
    const currentBatchData = await graphQlOrderByUIDBacthRequest<T, K>(
      query,
      responseKey,
      variables,
      orderBy,
      paginationVariableKey,
      remainingRecords,
      fromUID
    );

    ({ remainingRecords, fromUID } = getNextBatchData(
      remainingRecords,
      currentBatchData
    ));
    resultData = [...resultData, ...currentBatchData];
  }

  return resultData;
};

const autoPaginationGraphqlRequestSkedulo = async <
  T,
  K extends keyof T = keyof T
>(
  query: string,
  responseKey: string,
  variables: Record<string, string> = {},
  orderBy: K[],
  paginationVariableKey?: PaginationVariableKey
): Promise<T[]> => {
  const firstKey = paginationVariableKey
    ? paginationVariableKey.first
    : "first";
  const offsetKey = paginationVariableKey
    ? paginationVariableKey.offset
    : "offset";
  const orderByKey = paginationVariableKey
    ? paginationVariableKey.orderBy
    : "orderBy";
  const initVariable = {
    [offsetKey]: 0,
    [orderByKey]: orderBy.join(","),
    // offset and orderBy can be overide by variables
    ...variables,
    [firstKey]: MAX_PAGE_SIZE,
    // but first will all need to set to MAX to ensure fewer call
  };
  const defaultOffSet: number = toNumber(initVariable[offsetKey] || 0);

  const { totalCount, data: firstPageDatas } = await fetchOnePage<T>(
    query,
    responseKey,
    initVariable
  );

  if (totalCount === undefined) {
    throw new Error("missing total count in query");
  }

  // parallel load all subsequence page
  const remainingPage = Math.max(
    Math.ceil((totalCount - defaultOffSet) / MAX_PAGE_SIZE) - 1,
    0
  );
  const subsequenceData = flatMap(
    ({ data }) => data,
    await Promise.all(
      [...new Array(remainingPage)].map((item, index) =>
        fetchOnePage<T>(query, responseKey, {
          ...initVariable,
          [offsetKey]: defaultOffSet + (index + 1) * MAX_PAGE_SIZE,
        })
      )
    )
  );

  return [...firstPageDatas, ...subsequenceData];
};

export const autoPaginationGraphqlRequest = async <
  T extends HasUID,
  K extends keyof T = keyof T
>(
  query: string,
  responseKey: string,
  variables: Record<string, string> = {},
  orderBy: K[],
  paginationVariableKey?: PaginationVariableKey
): Promise<T[]> => {
  if (isSalesforce) {
    return autoPaginationGraphqlForSalesforce<T, K>(
      query,
      responseKey,
      variables,
      orderBy,
      paginationVariableKey
    );
  }
  return autoPaginationGraphqlRequestSkedulo<T, K>(
    query,
    responseKey,
    variables,
    orderBy,
    paginationVariableKey
  );
};
