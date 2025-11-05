# Issue: Update storybook-addon-apollo-client to Storybook 10

## Context

Storybook 10.0.0 has been released with a major breaking change: the framework now uses ESM-only modules. All Storybook addons must be updated to support this new architecture.

**Reference Issue:** https://github.com/JesusTheHun/storybook-addon-remix-react-router/issues/94

## Current State

- **Current Storybook Version:** 9.0.12
- **Package Manager:** npm
- **Build Tool:** tsup
- **Current Output:** ESM + CJS (dual format)
- **Entry Points:**
  - Export entries: `src/index.ts` (ESM + CJS)
  - Manager entries: `src/manager.tsx` (ESM)
  - Preview entries: `src/preview.ts` (ESM + CJS)

## Problem Statement

The addon currently builds with both ESM and CJS formats to support Storybook 9.x. With Storybook 10's ESM-only requirement, the build configuration and dependencies need to be updated to:

1. Output ESM-only modules
2. Update repository configuration files for ESM compatibility
3. Ensure all dependencies are compatible with Storybook 10
4. Maintain the addon's functionality while migrating to the new architecture

## Impact

### Breaking Changes
- Users on Storybook 9.x will need to upgrade to continue using future versions of this addon
- Build output will no longer include CJS format
- Package.json configuration may need ESM-specific fields

### Benefits
- Alignment with Storybook's future direction
- Simplified build configuration (ESM-only)
- Better tree-shaking and modern JavaScript features
- Continued support and compatibility with latest Storybook versions

## Constraints

- Must maintain backward compatibility for current 9.x users (consider versioning strategy)
- Build tool (tsup) must be configured to output ESM-only
- All peer dependencies must be updated to Storybook 10
- Testing framework integration needs verification with Storybook 10

## Success Criteria

1. Addon successfully builds with ESM-only output
2. All example stories work in Storybook 10
3. Addon panel displays correctly in Storybook 10 manager
4. Apollo Client mocking functionality remains intact
5. Documentation updated to reflect Storybook 10 requirements
6. CI/CD pipeline validates against Storybook 10
