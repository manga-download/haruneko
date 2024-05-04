export const argvPreloadScript = '--preload-script=';

const preload = process.argv.find(arg => arg.startsWith(argvPreloadScript))?.split(argvPreloadScript).pop() ?? '';
if(preload) {
    eval(atob(preload));
    console.log('======== Preload Script ========');
    console.log(atob(preload));
    console.log('================================');
}