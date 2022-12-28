// @ts-nocheck
import axios from "axios";
import "jspdf-autotable";
import mapValues from "lodash/mapValues";
import ReduxDataTypes, { EntryTypes, UID } from "src/StoreV2/DataTypes";
import { Vocabulary, Services, credentials, GraphQLRequest } from "./Services";
import { inlineLists } from "common-tags";

interface IGraphPageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}
interface IGraphQLFetchById {
  [key: string]: any;
  totalCount?: number;
  pageInfo?: IGraphPageInfo;
}

interface IGraphQLFetchByFilter {
  edges: { node: any; cursor: string; offset?: number }[];
  totalCount?: number;
  pageInfo?: IGraphPageInfo;
}

interface CreationResp {
  schema: { insertTimesheet: UID };
}
interface IGraphQLFetchResult {
  [key: string]: IGraphQLFetchById | IGraphQLFetchByFilter;
}

export interface IGraphQLMutationResult<T> {
  schema: {
    [operationName: string]: T;
  };
}

export class DataServices {
  private vocabularyP: Promise<Vocabulary> | null = null;

  constructor(private services: Services) {
    this.services = services;
  }

  private httpApi = axios.create({
    baseURL: credentials.apiServer,
    headers: {
      Authorization: `Bearer ${credentials.apiAccessToken}`,
    },
  });

  private transformResult<T>(result: IGraphQLFetchResult): T {
    return mapValues(result, (value) => {
      if (
        (value as IGraphQLFetchByFilter) &&
        (value as IGraphQLFetchByFilter).edges
      ) {
        return (value as IGraphQLFetchByFilter).edges.map((item) => item.node);
      }
      return value;
    }) as any as T;
  }

  fetchGraphQl = async <T>(params: GraphQLRequest): Promise<T> => {
    const { data } = await this.httpApi.post("/graphql/graphql", params);

    return this.transformResult(data.data);
  };

  mutateGraphQl = async <T>(
    params: GraphQLRequest
  ): Promise<IGraphQLMutationResult<T>> => {
    const { data } = await this.httpApi.post<{
      data: IGraphQLMutationResult<T>;
    }>("/graphql/graphql", params);
    return data.data;
  };

  getVocabulary() {
    if (!this.vocabularyP) {
      this.vocabularyP = this.services.metadata.fetchVocabulary();
    }

    return this.vocabularyP;
  }

  fetchJobs() {
    return this.fetchGraphQl<{ jobs: Job[] }>({
      query: JobsQuery,
    }).then(({ jobs }) => jobs);
  }

  fetchJobAllocations(
    jobIds: string[]
  ): Promise<{ jobAllocations: [{ UID: string }] }> {
    return this.fetchGraphQl({
      query: JobAllocationsQuery,
      variables: {
        filter: `JobId IN ${JSON.stringify(
          jobIds
        )} AND Status != 'Declined' AND Status != 'Deleted' AND Job.JobStatus != 'Cancelled'`,
      },
    });
  }

  fetchTimesheetById(timesheetId: string): Promise<{
    timesheetById: { UID: string; Timesheet: { JobId: string }[] };
  }> {
    return this.fetchGraphQl({
      query: TimeSheetQuery,
      variables: {
        id: timesheetId,
      },
    });
  }

  fetchTimeSheetEntriesByTypeID(
    typeIds: string[],
    typeName: EntryTypes
  ): Promise<{ timesheetEntry: Partial<ReduxDataTypes.TimesheetEntry[]> }> {
    return this.fetchGraphQl({
      query: TimeSheetEntryQuery,
      variables: {
        filter: `${typeName}Id IN ${JSON.stringify(typeIds)}`,
      },
    });
  }

  fetchProducts() {
    return this.fetchGraphQl<{ products: Product[] }>({
      query: ProductsQuery,
    }).then(({ products }) => products);
  }

  createProduct(input: NewProducts) {
    return this.services.graphQL.mutate({
      query: CreateProductMutation,
      variables: { input },
    });
  }

  createTimeSheet(input: Partial<ReduxDataTypes.Timesheet>) {
    return this.mutateGraphQl<string>({
      query: createTimesheetQuery,
      variables: {
        createInput: input,
      },
    });
  }

  createTimeSheetEntry(
    input: Partial<ReduxDataTypes.TimesheetEntry>,
    count: number
  ) {
    return this.mutateGraphQl<Partial<ReduxDataTypes.TimesheetEntry>>({
      query: createTimeSheetEntryQuery(count),
      variables: input,
    });
  }

  createLogError(input: NewErrorLog) {
    return this.services.graphQL.mutate({
      query: CreateErrorLogMutation,
      variables: { input },
    });
  }

  updateProduct(input: UpdateProduct & { UID: string }) {
    return this.services.graphQL.mutate({
      query: UpdateProductMutation,
      variables: { input },
    });
  }

  deleteProduct(id: string) {
    return this.services.graphQL.mutate({
      query: DeleteProductMutation,
      variables: {
        id,
      },
    });
  }

  async triggerGeneratePdf(
    shouldSendEmail: boolean,
    jobAllocationIds: string[]
  ) {
    return this.httpApi.post(
      "/function/ug-timesheet-pkg/timesheetFn/onGeneratePDF",
      {
        shouldSendEmail,
        jobAllocationIds,
      }
    );
  }

  async fetchPremiumOptions(): Promise<{ result: VocabularyItem[] }> {
    return (await this.httpApi.get("/custom/vocabulary/Resources/Premiums"))
      .data;
  }

  async fetchSkeduloSetting() {
    const skeduloAdminSettings = await this.fetchGraphQl<{
      skeduloAdminSetting: SkeduloAdminSetting[];
    }>({
      query: `
        query skeduloAdminSetting {
          skeduloAdminSetting {
            edges {
              node {
                UID
                ShowTimeSheetError
              }
            }
          }
        }`,
    });
    return skeduloAdminSettings;
  }

  async fetchPreference() {
    const { data } = await this.httpApi.get("/config/preference");
    return data.result;
  }

  async fetchUserMetaData() {
    const { data } = await this.httpApi.get("/auth/metadata/user");
    return data.result;
  }

  async addConfigPreference(data: Record<string, unknown>) {
    const res = await this.httpApi.post("/config/preference", data);
    return res.data;
  }

  async fetchConfigPreference() {
    const res = await this.httpApi.get("/config/preference");
    return res.data.result;
  }
}

export const dataService = new DataServices(Services);

/**
 * Query and Type Definitions
 */

export interface Job {
  UID: string;
  Name: string;
  Description: string;
}

const JobsQuery = `
{
  jobs {
    edges {
      node {
        UID
        Name
        Description
      }
    }
  }
}
`;

const JobAllocationsQuery = `
  query fetchJobAllocations($filter: EQLQueryFilterJobAllocations!) {
    jobAllocations(filter: $filter) {
      edges {
        node {
          UID
        }
      }
    }
  }
`;

const TimeSheetEntryQuery = `
  query fetchTimeSheetEntries($filter: EQLQueryFilterTimesheetEntry!) {
    timesheetEntry(filter: $filter) {
      edges {
        node {
          UID 
          JobId
          ActivityId
          UnavailabilityId
          ShiftId
          Timesheet {
            ResourceId
          }
        }
      }
    }
  }
`;

const TimeSheetQuery = `
  query fetchTimeSheet($id: ID!) {
    timesheetById(UID: $id)
    {
      UID
      Timesheet{
        JobId
      }
    }
  }
`;

export interface Product {
  Description: string;
  Family: string;
  IsActive: boolean;
  Name: string;
  ProductCode: string;
  UID: string;
}

export interface SkeduloAdminSetting {
  UID: string;
  ShowTimeSheetError: boolean;
}

const ProductsQuery = `
query Products {
  products {
    edges {
      node {
        UID
        Description
        Family
        IsActive
        Name
        ProductCode
      }
    }
  }
}
`;

export interface NewErrorLog {
  Name: string;
  Error: string;
  ErrorInfo: string;
  Path: string;
  UserInfo: string;
}

export interface NewProducts {
  Description: string;
  Family: string;
  IsActive: boolean;
  Name: string;
  ProductCode: string;
}

const CreateProductMutation = `
mutation CreateProduct($input: NewProducts!) {
  schema {
    insertProducts(input: $input)
  }
}
`;

const CreateErrorLogMutation = `
mutation CreateLog($input: NewErrorLog!) {
  schema {
    insertErrorLog(input: $input)
  }
}
`;

interface UpdateProduct {
  Description: string;
  Family: string;
  IsActive: boolean;
  Name: string;
  ProductCode: string;
  UID: string;
}

export interface VocabularyItem {
  active: boolean;
  controllingField: string;
  defaultValue: boolean;
  label: string;
  validFor: string[];
  value: string;
}

const UpdateProductMutation = `
mutation UpdateProductMutation($input: UpdateProducts!) {
  schema {
    updateProducts(input: $input)
  }
}
`;

const DeleteProductMutation = `
mutation DeleteProductMutation($id: ID!) {
  schema {
    deleteProducts(UID: $id)
  }
}
`;

const createTimeSheetEntryQuery = (count: number) => {
  const indexes = Array(count)
    .fill(null)
    .map((_, index) => index);
  return inlineLists(`
    mutation createTimesheetEntry(${indexes.map(
      (index) => `$input${index}: NewTimesheetEntry!`
    )}) {
      schema {
      ${indexes.map(
        (index) => `entry${index}:insertTimesheetEntry(input: $input${index})`
      )}
      }
    }
  `);
};

const createTimesheetQuery = `
mutation createTimesheet($createInput: NewTimesheet!) {
  schema {
    insertTimesheet(input: $createInput)
  }
}
`;
