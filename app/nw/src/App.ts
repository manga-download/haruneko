import { Command } from 'commander';
import { IPC } from './ipc/InterProcessCommunication';
import { RPCServer } from '../../src/rpc/Server';
import { RemoteProcedureCallContract } from './ipc/RemoteProcedureCallContract';
import { RemoteProcedureCallManager } from './ipc/RemoteProcedureCallManager';

type Manifest = {
    url: string;
    //'user-agent': undefined | string;
    //'chromium-args': undefined | string;
};

type CLIOptions = {
    origin?: string;
}

function ParseCLI(): CLIOptions {
    try {
        const argv = new Command()
            .allowUnknownOption(true)
            .option('--origin [url]', 'custom location from which the web-app shall be loaded')
            .parse(nw.App.argv, { from: 'user' });
        return argv.opts<CLIOptions>();
    } catch {
        return {};
    }
}

function GetDefaultURL(): string | undefined {
    try {
        return (nw.App.manifest as Manifest).url;
    } catch {
        return undefined;
    }
}

async function OpenWindow() {
    const argv = ParseCLI();
    const ipc = new IPC();
    const rpc = new RPCServer('/hakuneko', new RemoteProcedureCallContract(ipc));
    new RemoteProcedureCallManager(rpc, ipc);

    const url = argv.origin ?? GetDefaultURL() ?? 'about:blank';
    const win = await new Promise<NWJS_Helpers.win>((resolve, reject) => nw.Window.open(url, {
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