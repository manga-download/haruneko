import yargs from 'yargs';
import { RPCServer } from './rpc/Server';
import { Contract } from './rpc/Contract';
import { IPC } from './ipc/InterProcessCommunication';

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
        return (nw.App.manifest as Manifest).url;
    } catch {
        return undefined;
    }
}

async function OpenWindow() {

    const ipc = new IPC();
    ipc.RPC = new RPCServer('/hakuneko', new Contract(ipc));

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
}

OpenWindow();