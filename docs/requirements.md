# Requirements: Storybook 10 Migration

This document defines the requirements for migrating storybook-addon-apollo-client to Storybook 10 using EARS notation (Event-Action-Requirements Specification).

**Reference:** https://storybook.js.org/docs/addons/addon-migration-guide

## R1: Build Configuration (tsup)

### R1.1: ESM-Only Output
**WHEN** the addon is built, **THE SYSTEM SHALL** output ESM-only modules using `format: ["esm"]`.

**WHEN** tsup configuration is loaded, **THE SYSTEM SHALL NOT** import `globalManagerPackages` or `globalPreviewPackages` from Storybook internals.

**WHEN** the build completes, **THE SYSTEM SHALL** generate only `.js` files without `.cjs` equivalents.

### R1.2: Target Configuration
**WHEN** browser entry points are built, **THE SYSTEM SHALL** set `target: "esnext"` for manager and preview entries.

**WHEN** browser entry points are built, **THE SYSTEM SHALL** enable `splitting: true` for code splitting.

**WHEN** the Node target is configured, **THE SYSTEM SHALL** require Node 20.19+ as minimum version.

### R1.3: External Dependencies
**WHEN** dependencies are externalized, **THE SYSTEM SHALL** add `react`, `react-dom`, and `@storybook/icons` to the external list.

**WHEN** Storybook packages are externalized, **THE SYSTEM SHALL** use a manual externalization approach since global packages are removed.

### R1.4: Entry Points Consolidation
**WHEN** entry points are configured, **THE SYSTEM SHALL** remove `exportEntries` from tsup configuration.

**WHEN** `src/index.ts` functionality is needed, **THE SYSTEM SHALL** move exports to `previewEntries` configuration.

## R2: Package.json Configuration

### R2.1: Module Type Declaration
**WHEN** package.json is updated, **THE SYSTEM SHALL** add `"type": "module"` field at root level.

### R2.2: Exports Field
**WHEN** exports are defined, **THE SYSTEM SHALL** use `"default"` condition instead of separate `"import"`/`"require"` conditions.

**WHEN** export paths are specified, **THE SYSTEM SHALL** point to `.js` files only, removing all `.cjs` references.

**WHEN** the preset export is defined, **THE SYSTEM SHALL** change path from `.cjs` to `.js` format.

Example structure:
```json
"./preview": {
  "types": "./dist/index.d.ts",
  "default": "./dist/preview.js"
}
```

### R2.3: Dependencies
**WHEN** peer dependencies are declared, **THE SYSTEM SHALL** specify `"storybook": "^10.0.0"`.

**WHEN** dev dependencies are updated, **THE SYSTEM SHALL** upgrade all Storybook packages to `^10.0.0` or `next`.

**WHEN** package.json is validated, **THE SYSTEM SHALL** confirm removal of empty packages: `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/addon-links`, `@storybook/blocks`.

### R2.4: Keywords
**WHEN** package keywords are updated, **THE SYSTEM SHALL** change `"storybook-addons"` to `"storybook-addon"` (singular).

### R2.5: Build Scripts
**WHEN** build scripts are configured, **THE SYSTEM SHALL** add a prebuild script to clean dist folder before compilation.

## R3: TypeScript Configuration

### R3.1: Compiler Target
**WHEN** tsconfig.json is updated, **THE SYSTEM SHALL** change `target` from `"ES2020"` to `"esnext"`.

**WHEN** lib array is configured, **THE SYSTEM SHALL** change from `["es2020", "dom"]` to `["esnext", "dom"]`.

### R3.2: Root Directory
**WHEN** project structure is configured, **THE SYSTEM SHALL** change `rootDir` from `"./src"` to `"."`.

**WHEN** include array is updated, **THE SYSTEM SHALL** add `tsup.config.ts` to the included files.

### R3.3: Module Resolution
**WHEN** module resolution is configured, **THE SYSTEM SHALL** ensure compatibility with ESM imports.

## R4: Storybook Configuration

### R4.1: Local Preset Migration
**WHEN** local preset is updated, **THE SYSTEM SHALL** convert `.storybook/local-preset.js` to `.storybook/local-preset.ts`.

**WHEN** preset uses relative paths, **THE SYSTEM SHALL** use `import.meta.resolve()` for path resolution.

**WHEN** preset is referenced in main.ts, **THE SYSTEM SHALL** use `import.meta.resolve("./local-preset.ts")`.

### R4.2: Main Configuration
**WHEN** .storybook/main.ts is updated, **THE SYSTEM SHALL** reference the TypeScript preset file.

## R5: Addon Functionality

### R5.1: Decorator Behavior
**WHEN** a story uses the Apollo Client addon, **THE SYSTEM SHALL** wrap the story with MockedProvider.

**WHEN** mock configuration is provided via parameters, **THE SYSTEM SHALL** pass configuration to MockedProvider correctly.

**WHEN** channel communication occurs, **THE SYSTEM SHALL** emit mock data to the addon panel.

### R5.2: Manager Panel
**WHEN** the addon panel is opened, **THE SYSTEM SHALL** display the Apollo Client tab in the Storybook manager.

**WHEN** mock data is received, **THE SYSTEM SHALL** populate the dropdown with available mocks.

**WHEN** a user selects a mock, **THE SYSTEM SHALL** display query, variables, extensions, context, result, and error tabs.

### R5.3: Mock Features
**WHEN** a mock includes a delay parameter, **THE SYSTEM SHALL** simulate loading state for the specified duration.

**WHEN** a mock includes an error, **THE SYSTEM SHALL** render the error state in the component.

**WHEN** a mock includes variableMatcher, **THE SYSTEM SHALL** match queries using the custom matcher function.

## R6: CSF Factories Support (Optional but Recommended)

### R6.1: Preview Addon Definition
**WHEN** CSF Factories support is added, **THE SYSTEM SHALL** export a `definePreviewAddon` function from `src/index.ts`.

**WHEN** users utilize CSF Factories, **THE SYSTEM SHALL** provide enhanced type safety and composition features.

## R7: TypeScript Support

### R7.1: Type Declarations
**WHEN** the addon is built, **THE SYSTEM SHALL** generate `.d.ts` type declaration files.

**WHEN** types are imported, **THE SYSTEM SHALL** provide correct TypeScript definitions for ExtendedMockedRequest and ExtendedMockedResponse.

**WHEN** parameters are typed, **THE SYSTEM SHALL** enable autocomplete for apolloClient parameter configuration.

## R8: Example Stories

### R8.1: Story Compatibility
**WHEN** example stories are rendered, **THE SYSTEM SHALL** display components correctly in Storybook 10.

**WHEN** Storybook dev server runs, **THE SYSTEM SHALL** load all example stories without errors.

**WHEN** example stories use addon features, **THE SYSTEM SHALL** demonstrate delay, error, and variableMatcher functionality.

## R9: Documentation

### R9.1: README Updates
**WHEN** README is reviewed, **THE SYSTEM SHALL** add Storybook 10 to version compatibility matrix.

**WHEN** version table is updated, **THE SYSTEM SHALL** indicate version 10.x supports Storybook 10.x only.

### R9.2: CLAUDE.md Updates
**WHEN** CLAUDE.md is reviewed, **THE SYSTEM SHALL** reflect Storybook 10 as current supported version.

**WHEN** build configuration is documented, **THE SYSTEM SHALL** describe ESM-only output and updated tsup configuration.

### R9.3: Migration Guide
**WHEN** users upgrade from version 9.x, **THE SYSTEM SHALL** provide migration instructions in README or CHANGELOG.

## R10: Testing and Validation

### R10.1: Build Validation
**WHEN** the build runs, **THE SYSTEM SHALL** complete without errors.

**WHEN** output files are inspected, **THE SYSTEM SHALL** contain valid ESM syntax with `.js` extensions.

**WHEN** dist folder is examined, **THE SYSTEM SHALL NOT** contain `.cjs` files.

### R10.2: Runtime Validation
**WHEN** Storybook dev server starts, **THE SYSTEM SHALL** load the addon without module resolution errors.

**WHEN** stories are navigated, **THE SYSTEM SHALL** maintain addon state correctly between story changes.

**WHEN** the addon panel is interacted with, **THE SYSTEM SHALL** display all mock information correctly.

### R10.3: Integration Testing
**WHEN** example stories are tested, **THE SYSTEM SHALL** verify all Apollo Client mock scenarios work correctly.

**WHEN** channel communication is tested, **THE SYSTEM SHALL** confirm events flow between preview and manager.

## R11: Version Strategy

### R11.1: Semantic Versioning
**WHEN** the migration is complete, **THE SYSTEM SHALL** bump major version to 10.0.0 to align with Storybook 10.

**WHEN** release notes are published, **THE SYSTEM SHALL** document breaking changes and migration path from version 9.x.

**WHEN** npm package is published, **THE SYSTEM SHALL** tag the release appropriately for Storybook 10 users.

### R11.2: Multi-Version Support Decision
**WHEN** version strategy is decided, **THE SYSTEM SHALL** choose between:
- Option A: Support only Storybook 10 (recommended by Storybook team)
- Option B: Support both 9 and 10 with `"storybook": "^9.0.0 || ^10.0.0"` peer dependency

## Non-Functional Requirements

### NFR1: Node Version
**WHEN** the addon is installed, **THE SYSTEM SHALL** require Node 20.19 or higher.

### NFR2: Performance
**WHEN** the addon loads in Storybook, **THE SYSTEM SHALL** maintain similar or better load times compared to version 9.x.

### NFR3: Developer Experience
**WHEN** developers integrate the addon, **THE SYSTEM SHALL** provide clear error messages for configuration issues.

**WHEN** TypeScript types are used, **THE SYSTEM SHALL** provide accurate autocomplete and type checking.

### NFR4: Build Size
**WHEN** ESM output is generated with tree-shaking, **THE SYSTEM SHALL** produce equal or smaller bundle sizes compared to version 9.x.
