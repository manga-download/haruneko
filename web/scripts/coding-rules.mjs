import { exec } from 'node:child_process';

async function run(command) {
    return new Promise((resolve, reject) => exec(command, (error, stdout, _stderr) => error ? reject(error) : resolve(stdout)));
}

await (async function check() {
    const tempLocalMasterBranch = 'master-local';
    await run(`git fetch origin master:${tempLocalMasterBranch}`);
    const stdout = await run(`git diff --name-only ${tempLocalMasterBranch}`);
    const restrictedSourceFilesWithChanges = (stdout.split('\n') ?? [])
        .filter(line => /locales\/[a-z]{2,3}_[A-Z]{2,3}\.ts/.test(line))
        .filter(line => !line.includes('en_US.ts'))
        .map(line => `- ${line}`);
    let exitCode = 0;
    if(restrictedSourceFilesWithChanges.length > 0) {
        exitCode = 1;
        console.error([
            '',
            'It is not allowed to modify translation files which are handled by a continuous-localization service (e.g., Crowdin):',
            '',
            ...restrictedSourceFilesWithChanges,
            ''
        ].join('\n'));
    }
    await run(`git branch --delete --force ${tempLocalMasterBranch}`);
    process.exit(exitCode);
})();