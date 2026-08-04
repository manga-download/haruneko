// @ts-check
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = join('.', "web/src/engine/websites");
const outputFile = join(
    ".",
    "web/src/engine/websites/decorators/WordPressMadara_e2e.ts"
);

/** */
async function main() {
    const files = await readdir(root);

    // Keep only *_e2e.ts files
    const e2eFiles = files.filter(f => f.endsWith("_e2e.ts"));
    const validImports = [];

    for (const e2eFile of e2eFiles) {
        const base = e2eFile.replace("_e2e.ts", "");
        const codeFile = `${base}.ts`;
        const codePath = join(root, codeFile);

        try {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            const codeContent = await readFile(codePath, "utf8"); //we control file paths so it safe

            // Check if the base file contains "/decorators/WordPressMadara"
            if (codeContent.includes("/decorators/WordPressMadara")) {
                const relativeImport = `../${e2eFile}`;
                validImports.push(`import '${relativeImport.replace(".ts", "")}';`);
            }
        } catch {
            // Base file not found (e.g., no corresponding site.ts) → ignored
        }
    }

    const output = [
        // Generated imports
        ...validImports,
        ``,
    ].join("\n");

    await writeFile(outputFile, output, "utf8");

    console.log(`✔ Generated file: ${outputFile}`);
    console.log(`✔ ${validImports.length} E2E tests included`);
}

main().catch(err => {
    console.error("Error while generating the file:", err);
    process.exit(1);
});