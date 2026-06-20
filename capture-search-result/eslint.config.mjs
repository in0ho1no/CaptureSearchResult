import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import redos from "eslint-plugin-redos";

export default [
    {
        ignores: ["out/**", "dist/**", "**/*.d.ts"],
    },
    {
        files: ["**/*.ts"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            redos,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module",
            },
        },
        rules: {
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase"],
                },
            ],
            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "warn",
            // ReDoS(指数・多項式バックトラック)を持つ正規表現を検出してビルドを止める。
            // CodeQL(GitHub)に頼らず、ローカルの `npm run lint` とCIの pretest で事前検出する。
            "redos/no-vulnerable": "error",
        },
    },
];
