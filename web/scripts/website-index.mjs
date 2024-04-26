import path from 'node:path';
import fs from 'node:fs/promises';

const current = path.resolve('src', 'engine', 'websites');
const legacy = path.resolve('src', 'engine', 'websites', 'legacy');
const index = path.resolve('src', 'engine', 'websites', '_index.ts');

const imports = [];

async function concat(header, directory, prefix) {
    imports.push(header);
    const entries = (await fs.readdir(directory))
        .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', caseFirst: 'lower', numeric: true }))
        .filter(entry => /^[^._]+\.[jt]s$/.test(entry))
        .map(entry => entry.replace(/\.[jt]s$/, ''))
        .map(entry => `export { default as ${ entry } } from './${ prefix + entry }';`);
    imports.push(...entries);
}

await concat('// Implemented Websites', current, '');
await concat('// Legacy Websites', legacy, 'legacy/');
await fs.writeFile(index, imports.join('\n'), { mode: 0o755 });