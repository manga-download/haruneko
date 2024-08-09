export const argvPreloadScript = '--preload-script=';
const invoke: (script: string) => unknown = window['eval'];

const preload = process.argv.find(arg => arg.startsWith(argvPreloadScript))?.split(argvPreloadScript).pop() ?? '';
if(preload) {
    invoke(atob(preload));
    console.log('======== Preload Script ========');
    console.log(atob(preload));
    console.log('================================');
}