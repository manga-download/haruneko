export const argvPreloadScript = '--preload-script=';

const preload = process.argv.find(arg => arg.startsWith(argvPreloadScript))?.split(argvPreloadScript).pop() ?? '';
if(preload) {
    eval(atob(preload));
    eval(`(function(text) { console.log('Text:', text) })('Meow!')`);
    console.log('======== Preload Script ========');
    console.log(atob(preload));
    console.log('================================');
}