// @ts-check
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";

const ROOT = join('.', "web/src/engine/websites");
const OUTPUT_FILE = join(
    ".",
    "web/src/engine/websites/decorators/WordPressMadara_e2e.ts"
);

async function main() {
    const files = await readdir(ROOT);

    // Keep only *_e2e.ts files
    const e2eFiles = files.filter(f => f.endsWith("_e2e.ts"));

    const validImports = [];

    for (const e2eFile of e2eFiles) {
        const base = e2eFile.replace("_e2e.ts", "");
        const codeFile = `${base}.ts`;
        const codePath = join(ROOT, codeFile);

        try {
            const codeContent = await readFile(codePath, "utf8");

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

    await writeFile(OUTPUT_FILE, output, "utf8");

    console.log(`✔ Generated file: ${OUTPUT_FILE}`);
    console.log(`✔ ${validImports.length} E2E tests included`);
}

main().catch(err => {
    console.error("Error while generating the file:", err);
    process.exit(1);
});