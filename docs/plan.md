# Implementation Plan: Storybook 10 Migration

This document outlines the implementation plan for migrating storybook-addon-apollo-client to Storybook 10.

## Overview

The migration will be executed in phases to ensure stability and proper testing at each stage. Each phase has specific tasks with clear outcomes.

## Phase 1: Dependency Updates

### Task 1.1: Update Storybook Dependencies
**Description:** Update all Storybook-related packages to version 10.

**Actions:**
1. Update `package.json` peer dependencies to `"storybook": "^10.0.0"`
2. Update `package.json` dev dependencies:
   - `storybook`: `^10.0.0` (or `next` for testing)
   - `@storybook/addon-docs`: `^10.0.0`
   - `@storybook/addon-links`: `^10.0.0`
   - `@storybook/react-vite`: `^10.0.0`
3. Remove any empty/deprecated Storybook packages if present
4. Run `npm install` to update lockfile

**Outcome:** All Storybook packages are at version 10.x.

**Validation:** `npm list storybook @storybook/*` shows version 10.x for all packages.

---

### Task 1.2: Update Node Version Requirement
**Description:** Ensure Node 20.19+ is required.

**Actions:**
1. Update `package.json` engines field to specify `"node": ">=20.19.0"`
2. Update any CI/CD configuration to use Node 20.19+
3. Document Node version requirement in README

**Outcome:** Package requires Node 20.19 minimum.

**Validation:** Installation fails gracefully on Node versions < 20.19.

---

## Phase 2: Package Configuration

### Task 2.1: Add Module Type Declaration
**Description:** Configure package as ESM.

**Actions:**
1. Add `"type": "module"` to root of `package.json`

**Outcome:** Package is declared as ESM module.

**Validation:** Field is present in package.json.

---

### Task 2.2: Update Exports Field
**Description:** Restructure exports to use "default" condition only.

**Actions:**
1. Update each export in `package.json` to use this structure:
   ```json
   "./preview": {
     "types": "./dist/index.d.ts",
     "default": "./dist/preview.js"
   }
   ```
2. Remove all `"import"` and `"require"` conditions
3. Change all `.cjs` file references to `.js`
4. Update manager export: `"./manager": "./dist/manager.js"`
5. Keep types pointing to `.d.ts` files

**Outcome:** Exports use ESM-only structure with "default" condition.

**Validation:** No `.cjs` references remain; all point to `.js` files.

---

### Task 2.3: Update Keywords
**Description:** Update package keywords to singular form.

**Actions:**
1. Change `"storybook-addons"` to `"storybook-addon"` in keywords array

**Outcome:** Keywords follow Storybook 10 conventions.

**Validation:** Keywords array contains `"storybook-addon"`.

---

### Task 2.4: Add Prebuild Script
**Description:** Add clean script to remove old dist files.

**Actions:**
1. Add to scripts: `"prebuild": "rm -rf dist"`
2. Or use cross-platform tool: `"prebuild": "rimraf dist"` (requires rimraf package)

**Outcome:** Dist folder is cleaned before each build.

**Validation:** Running `npm run build` removes and recreates dist folder.

---

### Task 2.5: Update Bundler Config in package.json
**Description:** Remove exportEntries from bundler configuration.

**Actions:**
1. Remove `"exportEntries": ["src/index.ts"]` from bundler config
2. Move any necessary exports to previewEntries
3. Verify managerEntries and previewEntries are correct

**Outcome:** Bundler config only has managerEntries, previewEntries, and nodeEntries.

**Validation:** exportEntries field is removed from package.json.

---

## Phase 3: TypeScript Configuration

### Task 3.1: Update Compiler Options
**Description:** Update TypeScript to use esnext target.

**Actions:**
1. In `tsconfig.json`, change `"target"` from `"ES2020"` to `"esnext"`
2. Change `"lib"` from `["es2020", "dom"]` to `["esnext", "dom"]`
3. Change `"rootDir"` from `"./src"` to `"."`
4. Add `"tsup.config.ts"` to the `"include"` array

**Outcome:** TypeScript configured for esnext output and includes tsup config.

**Validation:** TypeScript compilation works without errors.

---

## Phase 4: Build Configuration (tsup)

### Task 4.1: Remove Global Packages Imports
**Description:** Remove Storybook global package imports.

**Actions:**
1. In `tsup.config.ts`, remove:
   ```typescript
   import { globalPackages as globalManagerPackages } from "storybook/internal/manager/globals";
   import { globalPackages as globalPreviewPackages } from "storybook/internal/preview/globals";
   ```
2. Remove references to these variables in externals arrays

**Outcome:** tsup config no longer imports global packages.

**Validation:** Build runs without errors after removal.

---

### Task 4.2: Update Format to ESM-Only
**Description:** Change all outputs to ESM format only.

**Actions:**
1. Change all `format: ["esm", "cjs"]` to `format: ["esm"]`
2. Change all `format: ["cjs"]` (if any) to `format: ["esm"]`

**Outcome:** All entry points build to ESM only.

**Validation:** Build output contains only `.js` files, no `.cjs` files.

---

### Task 4.3: Update Target and Splitting
**Description:** Set esnext target and enable splitting.

**Actions:**
1. Change `BROWSER_TARGET` from `["chrome100", "safari15", "firefox91"]` to simply using `"esnext"` string
2. For browser entry configs (manager, preview), set:
   - `target: "esnext"`
   - `splitting: true`
3. Update NODE_TARGET if needed to `["node20.19"]`

**Outcome:** Build targets esnext with code splitting enabled.

**Validation:** Built files use modern JavaScript features.

---

### Task 4.4: Update External Dependencies
**Description:** Add react, react-dom, and @storybook/icons to externals.

**Actions:**
1. Create manual externals array:
   ```typescript
   const commonExternals = [
     'react',
     'react-dom',
     '@storybook/icons',
     /^storybook\/.*/,
     /^@storybook\/.*/,
   ];
   ```
2. Add to external field in each config: `external: commonExternals`

**Outcome:** Required packages are externalized.

**Validation:** Built files don't bundle react, react-dom, or @storybook/icons.

---

### Task 4.5: Remove exportEntries Logic
**Description:** Remove exportEntries configuration from tsup.

**Actions:**
1. Remove the exportEntries configuration block from tsup.config.ts
2. If `src/index.ts` exports are needed, ensure they're in previewEntries
3. Update build to only handle managerEntries, previewEntries, nodeEntries

**Outcome:** tsup config no longer processes exportEntries.

**Validation:** Build completes and exports are accessible.

---

### Task 4.6: Update Platform Settings
**Description:** Ensure platform settings are correct.

**Actions:**
1. Verify manager entries have `platform: "browser"`
2. Verify preview entries have `platform: "browser"`
3. Verify node entries (if any) have `platform: "node"`

**Outcome:** Platform settings match entry point targets.

**Validation:** No platform-related build warnings.

---

## Phase 5: Storybook Configuration

### Task 5.1: Convert Local Preset to TypeScript
**Description:** Convert `.storybook/local-preset.js` to `.storybook/local-preset.ts`.

**Actions:**
1. Check current extension of local-preset file
2. If `.js`, rename to `.ts`
3. Convert any CommonJS syntax to ESM:
   - Replace `module.exports` with `export default`
   - Replace `require()` with `import`
4. If using relative paths, use `import.meta.resolve()`:
   ```typescript
   managerEntries: [import.meta.resolve("../dist/manager.js")]
   ```

**Outcome:** Local preset uses TypeScript and ESM syntax.

**Validation:** File is `.ts` and uses ESM syntax.

---

### Task 5.2: Update Main Configuration
**Description:** Update reference to local preset in main.ts.

**Actions:**
1. In `.storybook/main.ts`, update addons array to use:
   ```typescript
   addons: [
     "@storybook/addon-links",
     import.meta.resolve("./local-preset.ts"),
     "@storybook/addon-docs"
   ]
   ```

**Outcome:** Main config references TypeScript preset.

**Validation:** Storybook starts without errors.

---

## Phase 6: Source Code Updates (if needed)

### Task 6.1: Review Import Statements
**Description:** Ensure all imports use ESM syntax.

**Actions:**
1. Search codebase for any `require()` statements
2. Convert to `import` statements
3. Ensure file extensions are included where needed for ESM

**Outcome:** All source files use ESM imports.

**Validation:** No require() statements in src/ directory.

---

### Task 6.2: Add CSF Factories Support (Optional)
**Description:** Export definePreviewAddon for CSF Factories.

**Actions:**
1. In `src/index.ts`, add and export `definePreviewAddon` function
2. Follow Storybook's CSF Factories API
3. Update type definitions

**Outcome:** Addon supports CSF Factories pattern.

**Validation:** Users can use definePreviewAddon in their stories.

**Priority:** Optional - can be done in a follow-up release.

---

## Phase 7: Testing and Validation

### Task 7.1: Build Testing
**Description:** Verify build completes successfully.

**Actions:**
1. Run `npm run build`
2. Inspect `dist/` folder for:
   - Only `.js` files (no `.cjs`)
   - `.d.ts` type declaration files
   - Proper directory structure
3. Check that file sizes are reasonable

**Outcome:** Build completes without errors and outputs correct files.

**Validation:**
- `dist/manager.js` exists
- `dist/preview.js` exists
- `dist/index.d.ts` exists
- No `.cjs` files in dist/

---

### Task 7.2: Storybook Dev Server Testing
**Description:** Test addon in Storybook development mode.

**Actions:**
1. Run `npm start` or `npm run storybook`
2. Verify Storybook starts without errors
3. Check browser console for errors
4. Navigate to example stories
5. Verify Apollo Client addon panel appears
6. Test mock selection dropdown
7. Test all tabs (Query, Variables, Extensions, Context, Result, Error)

**Outcome:** Storybook runs and addon functions correctly.

**Validation:** All example stories render and addon panel works.

---

### Task 7.3: Story Functionality Testing
**Description:** Test all addon features in stories.

**Actions:**
1. Test `WithResponse` story - verify data loads
2. Test `WithDelayedResponse` story - verify loading state
3. Test `WithError` story - verify error handling
4. Test `WithVariableMatcher` story - verify matcher works
5. Navigate between stories - verify state management
6. Test hard refresh scenario (known MockedProvider issue)

**Outcome:** All story scenarios work as expected.

**Validation:** Each story demonstrates intended functionality.

---

### Task 7.4: Build Output Testing
**Description:** Test built addon can be imported.

**Actions:**
1. Run `npm run build`
2. In a test project, install the built addon locally
3. Verify it can be imported in both manager and preview contexts
4. Test that types are recognized by TypeScript

**Outcome:** Built addon is importable and functional.

**Validation:** Test project successfully uses the addon.

---

## Phase 8: Documentation Updates

### Task 8.1: Update README
**Description:** Update README with Storybook 10 information.

**Actions:**
1. Add Storybook 10 to version compatibility table:
   - "If you're using Apollo Client 3.x and Storybook 10.x use version 10.x"
2. Update any version-specific instructions
3. Add migration notes for users upgrading from v9
4. Update Node version requirement

**Outcome:** README reflects Storybook 10 support.

**Validation:** Version table includes Storybook 10.x.

---

### Task 8.2: Update CLAUDE.md
**Description:** Update CLAUDE.md with new build configuration.

**Actions:**
1. Update version support section to include 10.x
2. Update build configuration section to mention ESM-only
3. Update architecture section if tsup config changed significantly
4. Update Node version requirement

**Outcome:** CLAUDE.md is current for version 10.

**Validation:** Documentation matches new implementation.

---

### Task 8.3: Update CHANGELOG
**Description:** Document breaking changes.

**Actions:**
1. Add entry for version 10.0.0
2. List breaking changes:
   - Storybook 10 requirement
   - ESM-only builds
   - Node 20.19+ requirement
3. Add migration instructions
4. Credit contributors

**Outcome:** CHANGELOG documents the migration.

**Validation:** CHANGELOG.md has v10.0.0 entry.

---

### Task 8.4: Create Migration Guide (Optional)
**Description:** Create detailed migration guide for users.

**Actions:**
1. Create `MIGRATION.md` or section in README
2. Document step-by-step upgrade process
3. List common issues and solutions
4. Provide before/after examples

**Outcome:** Users have clear migration path.

**Validation:** Migration guide is comprehensive.

**Priority:** Optional but recommended.

---

## Phase 9: Release Preparation

### Task 9.1: Version Bump
**Description:** Update version to 10.0.0.

**Actions:**
1. Update `package.json` version to `"10.0.0"`
2. Follow semantic versioning
3. Ensure version aligns with Storybook 10

**Outcome:** Package version is 10.0.0.

**Validation:** package.json shows "version": "10.0.0".

---

### Task 9.2: Pre-release Testing (Optional)
**Description:** Release a prerelease version for testing.

**Actions:**
1. Publish as `10.0.0-beta.0` or similar
2. Tag with `next` on npm: `npm publish --tag next`
3. Gather feedback from community
4. Fix any issues found

**Outcome:** Community-tested prerelease available.

**Validation:** Prerelease available on npm with `next` tag.

**Priority:** Optional but recommended.

---

### Task 9.3: Final Release
**Description:** Publish stable v10.0.0.

**Actions:**
1. Ensure all tests pass
2. Ensure documentation is complete
3. Run `npm run release` or manual publish process
4. Tag release in git
5. Create GitHub release with notes

**Outcome:** Version 10.0.0 published to npm.

**Validation:**
- npm shows 10.0.0 as latest
- GitHub has release tag

---

## Implementation Timeline

**Estimated Effort:** 2-3 days

**Phase-by-Phase Estimates:**
- Phase 1 (Dependencies): 30 minutes
- Phase 2 (Package Config): 1 hour
- Phase 3 (TypeScript): 30 minutes
- Phase 4 (Build Config): 2 hours
- Phase 5 (Storybook Config): 1 hour
- Phase 6 (Source Updates): 1-2 hours (depending on CSF Factories)
- Phase 7 (Testing): 3-4 hours
- Phase 8 (Documentation): 2 hours
- Phase 9 (Release): 1 hour

## Risk Mitigation

**Risk 1:** Build breaks due to external dependency changes
- **Mitigation:** Test build after each phase
- **Fallback:** Use Storybook 10 prerelease for testing first

**Risk 2:** Runtime errors in Storybook 10
- **Mitigation:** Thorough testing in Phase 7
- **Fallback:** Community testing via prerelease

**Risk 3:** Breaking changes affect users
- **Mitigation:** Clear documentation and migration guide
- **Fallback:** Support channel for migration issues

**Risk 4:** Type definitions break
- **Mitigation:** Test types in separate TypeScript project
- **Fallback:** Publish type fixes in patch release

## Success Criteria

- [ ] All Storybook packages at 10.x
- [ ] Build completes without errors
- [ ] Only ESM `.js` files in output (no `.cjs`)
- [ ] Storybook dev server starts successfully
- [ ] All example stories render correctly
- [ ] Addon panel displays all mock information
- [ ] TypeScript types work correctly
- [ ] Documentation updated
- [ ] Version published to npm

## Next Steps

After completing this migration:
1. Monitor npm downloads and GitHub issues
2. Provide community support for migrations
3. Consider future enhancements (CSF Factories if not done)
4. Keep up with Storybook 10.x minor updates
