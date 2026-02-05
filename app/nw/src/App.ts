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
            .allowExcessArguments(true)
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

    // Fallback: Show window after 10 seconds if web app hasn't shown it
    // This ensures the window is visible even if the web app fails to load
    let showTimeout: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        if(!win.isVisible()) {
            console.warn('Web app did not show window within timeout, showing window as fallback');
            win.show();
        }
        showTimeout = null;
    }, 10000);

    // Clear timeout when web app loads successfully
    win.on('loaded', () => {
        if(showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }
    });

    win.on('close', () => {
        if(showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }
        rpc.Stop();
        nw.App.closeAllWindows();
        nw.App.quit();
    });
}

OpenWindow();