import * as fs from 'fs-extra';
import yargs from 'yargs';
import { IPC } from './ipc/InterProcessCommunication';
import { RPCServer } from './rpc/Server';

async function GetArgumentURL(): Promise<string|undefined> {
    try {
        /*
        type Arguments = {
            origin?: string;
        }
        */
        const argv/*: Arguments*/ = await yargs(nw.App.argv).argv;
        return argv.origin as string;
    } catch {
        return undefined;
    }
}

async function GetDefaultURL(): Promise<string|undefined> {
    try {
        type Manifest = {
            url?: string;
        }
        // TODO: Is it possible to read a relative path in bundled NW application?
        const manifest: Manifest = await fs.readJSON('package.json');
        return manifest.url;
    } catch {
        return undefined;
    }
}

async function OpenWindow() {
    const url = await GetArgumentURL() ?? await GetDefaultURL();

    const win = await new Promise<NWJS_Helpers.win>((resolve, reject) => nw.Window.open(url ?? 'about:blank', {
        id: 'hakuneko',
        show: url ? false : true,
        frame: url ? false : true,
        transparent: url ? true : false,
        width: 1280,
        height: 720,
        position: 'center',
        //title: 'HakuNeko',
    }, win => win ? resolve(win) : reject()));

    if(!url) {
        win.showDevTools();
    }

    /*const rpc = */new RPCServer('/hakuneko').Listen(27544, 'Connection#Secret', [ /^(chrome-)?extension:/i ]);
    const ipc = new IPC();

    // Dummy Stuff for Development
    setTimeout(async () => {
        console.log('Foo Result:', await ipc.Foo(Math.random()));
        console.log('Bar Result:', await ipc.Bar(Math.random()));
    }, 7500);
}

OpenWindow();