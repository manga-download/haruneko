import path from 'path';
import fs from 'fs-extra';
import { appendFileSync } from 'fs';

const current = path.resolve('src', 'engine', 'websites');
const legacy = path.resolve('src', 'engine', 'websites', 'legacy');
const index = path.resolve('src', 'engine', 'websites', '_index.ts');

const imports = [];

async function concat(header, directory, prefix) {
    imports.push(header);
    const entries = (await fs.readdir(directory))
        .filter(entry => entry.endsWith('.ts') && !entry.includes('_'))
        .map(entry => entry.replace(/\.ts$/, ''))
        .map(entry => `export { default as ${ entry } } from './${ prefix + entry }';`);
    imports.push(...entries);
}

await concat('// Implemented Websites', current, '');
await concat('// Legacy Websites', legacy, 'legacy/');
await fs.writeFile(index, imports.join('\n'), { mode: 0o755 });