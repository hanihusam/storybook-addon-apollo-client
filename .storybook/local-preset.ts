import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * to load the built addon in this test Storybook
 */
function previewAnnotations(entry: string[] = []) {
  return [...entry, join(__dirname, "../dist/preview.js")];
}

function managerEntries(entry: string[] = []) {
  return [...entry, join(__dirname, "../dist/manager.js")];
}

export { managerEntries, previewAnnotations };
