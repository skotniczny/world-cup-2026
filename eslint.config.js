import prettier from "eslint-config-prettier"
import path from "node:path"
import { includeIgnoreFile } from "@eslint/compat"
import eslint from "@eslint/js"
import svelte from "eslint-plugin-svelte"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"
import svelteConfig from "./svelte.config.js"

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore")

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  eslint.configs.recommended,
  tseslint.configs.strict,
  svelte.configs.recommended,
  prettier,
  svelte.configs.prettier,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: tseslint.parser,
        svelteConfig,
      },
    },
  },
)
