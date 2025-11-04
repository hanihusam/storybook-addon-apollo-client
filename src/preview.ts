import { type DecoratorFunction } from "storybook/internal/csf";
import { withApolloClient } from "./withApolloClient";

export const decorators: DecoratorFunction[] = [withApolloClient];
