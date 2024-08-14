export const argvPreloadScript = '--preload-script=';
const invoke: (script: string) => unknown = globalThis['eval'];

const preload = process.argv.find(arg => arg.startsWith(argvPreloadScript))?.split(argvPreloadScript).at(-1) ?? '';
if(preload) {
    invoke(atob(preload));
    console.log('======== Preload Script ========');
    console.log(atob(preload));
    console.log('================================');
}