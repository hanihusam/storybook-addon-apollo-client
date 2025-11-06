# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Storybook addon that enables Apollo Client integration in Storybook stories. It allows developers to mock GraphQL queries and mutations using Apollo Client's MockedProvider, with a dedicated panel UI to inspect mocks, queries, variables, and responses.

## Build and Development Commands

```bash
# Build the addon (production)
npm run build

# Build and watch for changes
npm run build:watch

# Start Storybook development server with auto-rebuild
npm start

# Run Storybook standalone (port 6006)
npm run storybook

# Build Storybook static site
npm run build-storybook

# Format code with Prettier
npm run format

# Release process (builds and publishes)
npm run release
```

## Architecture

### Entry Points

The addon has three distinct entry points defined in `package.json` bundler config:

1. **Export entries** (`src/index.ts`): Public API for manual imports
2. **Manager entries** (`src/manager.tsx`): Storybook manager UI (addon panel registration)
3. **Preview entries** (`src/preview.ts`): Story decorator that wraps stories with MockedProvider

### Core Components

**Decorator System** (`src/withApolloClient.tsx`):
- The `withApolloClient` decorator wraps stories with Apollo's `MockedProvider`
- Uses Storybook's channel API to communicate between preview and manager
- Reads mock configuration from `parameters.apolloClient`
- Emits mock data and parsed queries to the addon panel via `EVENTS.RESULT`

**Manager Panel** (`src/Panel.tsx`):
- Registers the "Apollo Client" panel in Storybook's addon panel area
- Listens for `STORY_RENDERED` and `STORY_CHANGED` events to request mock data
- Displays dropdown to select between multiple mocks in a story
- Shows mock name extracted from `operationName` or query definition

**Panel Content** (`src/components/PanelContent.tsx`):
- Tabbed interface displaying: Query (GraphQL), Variables, Extensions, Context, Result, Error
- Uses Storybook's `SyntaxHighlighter` for formatted display
- Each tab only shown when data is available

### Type System

**Extended Types** (`src/types.ts`):
- `ExtendedMockedRequest`: Extends Apollo's `MockLink.MockedRequest` with `operationName`, `extensions`, `context`
- `ExtendedMockedResponse`: Extends Apollo's `MockLink.MockedResponse` with `variableMatcher` function
- `ApolloClientParameters`: Story parameter type accepting MockedProvider props plus extended types

### Event System

Constants in `src/constants.ts`:
- `PARAM_KEY`: "apolloClient" - parameter key in story definitions
- `EVENTS.REQUEST`: Manager requests mock data from preview
- `EVENTS.RESULT`: Preview sends mock data to manager
- `EVENTS.CLEAR`: Clears addon state

### Build Configuration

**tsup** (`tsup.config.ts`):
- Builds multiple entry points with different targets
- Manager entries: ESM only, esnext target, browser platform, code splitting enabled
- Preview entries: ESM only, esnext target, browser platform, code splitting enabled, generates TypeScript declarations
- Node entries: ESM only, Node 20.19+ target (if needed)
- Externalizes: react, react-dom, @storybook/icons, and all Storybook internal packages
- No longer uses global packages imports from Storybook (manual externals instead)

## Story Parameter Structure

Stories configure Apollo mocks via the `apolloClient` parameter:

```typescript
export const MyStory: Story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: MY_QUERY,
            variables: { id: 1 },
            operationName: "MyOperation", // optional, for panel display
            extensions: {},                // optional, shown in Extensions tab
            context: {},                   // optional, shown in Context tab
          },
          result: {
            data: { /* ... */ }
          },
          // OR
          error: new ApolloError({ errorMessage: "..." }),
          delay: 1000,                     // optional, simulates loading
          variableMatcher: (vars) => true, // optional, matches any variables
        }
      ],
      // Any other MockedProvider props (defaultOptions, cache, etc.)
    }
  }
};
```

## Version Support

- Version 7.x: Apollo Client 2.x/3.x + Storybook 8.x
- Version 8.x: Apollo Client 3.x + Storybook 8.3+
- Version 9.x: Apollo Client 3.x + Storybook 9.x
- Current version (10.x): Apollo Client 3.x + Storybook 10.x (requires Node 20.19+)

Migration from 5.x-6.x to 7.x+ removed `globalMocks` in favor of mock composition at the story level.

## Known Issues

MockedProvider behavior requires hard refresh when navigating between stories in the same file. See: https://github.com/apollographql/apollo-client/issues/9738#issuecomment-1606316338
