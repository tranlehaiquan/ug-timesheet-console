import get from "lodash/get";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
  context?: Record<string, any>;
  extensions?: Record<string, any>;
}

export interface GraphQLMutationResult {
  data: null | { schema: { [operationName: string]: string } };
  errors:
    | null
    | {
        message: string;
        path?: string[];
        locations?: { line: number; column: number }[];
      }[];
}

interface GraphQLError {
  getErrors: () => string[];
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (): GraphQLError;
}

type Model = string;

interface IntrospectionField {
  name: string;
  type: {
    name: null | "Instant" | "Boolean" | "BigDecimal" | "String" | Model;
    kind: "SCALAR" | "NON_NULL" | "OBJECT" | "LIST";
    ofType: null | IntrospectionField["type"];
  };
}

interface IntrospectionModelType {
  __type: {
    name: string;
    fields: IntrospectionField[];
  };
}

export interface Vocabulary {
  [schema: string]: {
    [field: string]: {
      value: string;
      label: string;
    }[];
  };
}

export interface Services {
  graphQL: {
    fetch<T>(operation: GraphQLRequest, endpoint?: string): Promise<T>;
    mutate<T = GraphQLMutationResult>(
      operation: GraphQLRequest,
      endpoint?: string
    ): Promise<T>;
    fetchMetadataFor(model: string): Promise<IntrospectionModelType>;
  };
  metadata: {
    fetchVocabulary(): Promise<Vocabulary>;
    _apiService: { get<T>(endpoint: string, options?: {}): Promise<T> };
    fetchCurrentUserMetadata(): Promise<{ id: string }>;
  };
  errorClasses: {
    GraphQLNetworkError: GraphQLError;
    GraphQLExecutionError: GraphQLError;
  };
}

export interface Credentials {
  apiServer: string;
  apiAccessToken: string;

  vendor:
    | { type: "skedulo"; url: string; token: null }
    | { type: "salesforce"; url: string; token: string };
}

const skedInjected = get(window, "skedInjected", {}) as {
  Services: Services;
  context?: string;
  credentials: Credentials;
};

const getCredential = () => {
  return {
    ...get(window, "skedInjected", {}),
    apiServer:
      import.meta.env.VITE_API_SERVER || skedInjected?.credentials?.apiServer,
    apiAccessToken:
      import.meta.env.VITE_API_ACCESS_TOKEN ||
      skedInjected?.credentials?.apiAccessToken,
  };
};

export const Services = skedInjected.Services;
export const context = skedInjected.context;
export const credentials = getCredential();
