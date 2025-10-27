import { type MockLink } from "@apollo/client/testing";
import { type MockedProviderProps } from "@apollo/client/testing/react";

// Extended MockedRequest to include optional properties
export interface ExtendedMockedRequest extends MockLink.MockedRequest {
  operationName?: string;
  extensions?: Record<string, any>;
  context?: Record<string, any>;
}

// Extended MockedResponse to include variableMatcher
export interface ExtendedMockedResponse
  extends Omit<MockLink.MockedResponse, "request"> {
  request: ExtendedMockedRequest;
}

export type ApolloClientAddonState = {
  mocks: ExtendedMockedResponse[];
  queries: string[];
};

export interface ApolloClientTypes {
  parameters: {
    apolloClient?: ApolloClientParameters;
  };
}

export type ApolloClientParameters = Partial<
  Omit<MockedProviderProps, "children">
>;
