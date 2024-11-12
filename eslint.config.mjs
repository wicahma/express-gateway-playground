import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import _import from "eslint-plugin-import";
import node from "eslint-plugin-node";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/dist/",
        "**/coverage",
        "admin/node_modules",
        "bin/generators/gateway/templates/basic/server.js",
        "bin/generators/gateway/templates/getting-started/server.js",
    ],
}, ...fixupConfigRules(compat.extends(
    "standard",
    "plugin:node/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
)), {
    plugins: {
        import: fixupPluginRules(_import),
        node: fixupPluginRules(node),
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },
    },

    rules: {
        "space-before-function-paren": 0,
        "comma-dangle": [2, "never"],
        "no-var": "error",
        semi: [2, "always"],
        "no-console": "warn",
        "no-prototype-builtins": "off",
        "prefer-const": "error",

        "node/no-deprecated-api": ["error", {
            ignoreModuleItems: ["crypto.createCipher", "crypto.createDecipher", "url.parse"],
        }],
    },
}];