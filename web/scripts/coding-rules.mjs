import { exec } from 'node:child_process';

async function run(command) {
    return new Promise((resolve, reject) => exec(command, (error, stdout, _stderr) => error ? reject(error) : resolve(stdout)));
}

await (async function check() {
    await run(`git fetch origin master:master-local`);
    const stdout = await run(`git diff --name-only master-local`);
    const restrictedSourceFilesWithChanges = (stdout.split('\n') ?? [])
        .filter(line => /locales\/[a-z]{2,3}_[A-Z]{2,3}\.ts/.test(line))
        .filter(line => !line.includes('en_US.ts'))
        .map(line => `- ${line}`);
    if(restrictedSourceFilesWithChanges.length > 0) {
        console.error([
            '',
            'It is not allowed to modify translation files which are handled by a continuous-localization service (e.g., Crowdin):',
            '',
            ...restrictedSourceFilesWithChanges,
            ''
        ].join('\n'));
        process.exit(1);
    }
})();