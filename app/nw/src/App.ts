import yargs from 'yargs';
import { IPC } from './ipc/InterProcessCommunication';
import { RPCServer } from '../../src/rpc/Server';
import { RemoteProcedureCallContract } from './ipc/RemoteProcedureCallContract';
import { RemoteProcedureCallManager } from './ipc/RemoteProcedureCallManager';

type Manifest = {
    url: string;
    //'user-agent': undefined | string;
    //'chromium-args': undefined | string;
};

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
        return (nw.App.manifest as Manifest).url;
    } catch {
        return undefined;
    }
}

async function OpenWindow() {
    const ipc = new IPC();
    const rpc = new RPCServer('/hakuneko', new RemoteProcedureCallContract(ipc));
    new RemoteProcedureCallManager(rpc, ipc);

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

    win.on('close', () => {
        rpc.Stop();
        nw.App.closeAllWindows();
        nw.App.quit();
    });
}

OpenWindow();