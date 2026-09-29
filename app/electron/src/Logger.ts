import { StringDecoder } from 'node:string_decoder';

const ElectronPreloadContextWorld = 999;

export class Logger {

    readonly #decoder = new StringDecoder('utf-8');

    public constructor(webContents: Electron.WebContents) {
        this.#Intercept('stdout', webContents, 'log');
        this.#Intercept('stderr', webContents, 'error');
    }

    #Intercept(stream: 'stdout' | 'stderr', webContents: Electron.WebContents, console: 'log' | 'warn' | 'error') {
        Object.defineProperty(process[stream], 'isTTY', { value: false }); // Disable ANSI control sequences
        const nativeStdWrite = process[stream].write;
        process[stream].write = (buffer: string | Uint8Array<ArrayBufferLike>) => {
            try {
                const text = JSON.stringify(typeof buffer === 'string' ? buffer : this.#decoder.write(buffer)).trim();
                webContents
                    .executeJavaScriptInIsolatedWorld(ElectronPreloadContextWorld, [{ code: `console.${console}('<Electron::${stream.toUpperCase()}>', ${text});` }])
                    .catch(() => { });
            } catch { }
            return nativeStdWrite.call(process[stream], buffer);
        };
    }
}