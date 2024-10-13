export const argvPreloadScript = '--preload-script=';
const invoke: (script: string) => unknown = globalThis['eval'];

// TODO: Distinguish `process.isMainFrame` to detemrine running preload script?

const preload = process.argv.find(arg => arg.startsWith(argvPreloadScript))?.split(argvPreloadScript).at(-1) ?? '';
if(preload) {
    invoke(atob(preload));
    console.log('======== Preload Script Invoked ========');
}