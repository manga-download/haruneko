import path from 'path';
import fs from 'fs/promises';
import { app } from 'electron';
import { Command } from 'commander';
import { IPC } from './ipc/InterProcessCommunication';
import { ApplicationWindow } from './ipc/ApplicationWindow';
import { FetchProvider } from './ipc/FetchProvider';
import { InitializeMenu } from './Menu';
import { BloatGuard } from './ipc/BloatGuard';
import { RemoteBrowserWindowController } from './ipc/RemoteBrowserWindow';
import { RPCServer } from '../../src/rpc/Server';
import { RemoteProcedureCallManager } from './ipc/RemoteProcedureCallManager';
import { RemoteProcedureCallContract } from './ipc/RemoteProcedureCallContract';
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

type CLIOptions = {
    origin?: string;
}

app.commandLine.appendSwitch('allow-running-insecure-content');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

function ParseCLI(): CLIOptions {
    try {
        const argv = new Command()
            .allowUnknownOption(true)
            .allowExcessArguments(true)
            .option('--origin [url]', 'custom location from which the web-app shall be loaded')
            .parse(process.argv, { from: 'electron' });
        return argv.opts<CLIOptions>();
    } catch {
        return {};
    }
}

type Manifest = {
    url: string;
    'user-agent': undefined | string;
    'user-data-dir': undefined | string;
};

async function LoadManifest(): Promise<Manifest> {
    const file = path.resolve(app.getAppPath(), 'package.json');
    const content = await fs.readFile(path.normalize(file), { encoding: 'utf-8' });
    return JSON.parse(content) as Manifest;
}

async function SetupUserDataDirectory(manifest: Manifest): Promise<void> {
    const userDataDir = manifest['user-data-dir'];
    // TODO: Do not replace when already set via commandline
    if(/* !argv['user-data-dir'] && */ userDataDir) {
        app.setPath('userData', path.isAbsolute(userDataDir) ? userDataDir : path.resolve(path.dirname(app.getPath('exe')), userDataDir));
    }
}

async function CreateApplicationWindow(): Promise<ApplicationWindow> {
    const win = new ApplicationWindow({
        show: false,
        width: 1280,
        height: 800,
        center: true,
        frame: false,
        transparent: true,
        //icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
        webPreferences: {
            webSecurity: false, // Bypass CORS checks
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            disableBlinkFeatures: 'AutomationControlled',
            preload: path.resolve(app.getAppPath(), 'preload.js'),
        },
    });

    win.setMenuBarVisibility(false);
    win.on('closed', () => app.quit());

    return win;
}

function CheckHostPermission(url: string, appURI: URL) {
    try {
        return new URL(url).hostname === appURI.hostname;
    } catch {
        return false;
    }
}

function UpdatePermissions(session: Electron.Session, appURI: URL) {
    session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => CheckHostPermission(requestingOrigin, appURI));
    session.setPermissionRequestHandler((webContents, permission, callback, details) => callback(CheckHostPermission(details.requestingUrl, appURI)));
    // TODO: May remove the following workaround when https://github.com/electron/electron/issues/41957 is solved
    session.on('file-system-access-restricted', (event, details, callback) => callback(CheckHostPermission(details.origin, appURI) ? 'allow' : 'deny'));
}

async function OpenWindow(): Promise<void> {
    try {
        InitializeMenu();
        const argv = ParseCLI();
        const manifest = await LoadManifest();
        await SetupUserDataDirectory(manifest);
        app.userAgentFallback = manifest['user-agent'] ?? app.userAgentFallback.split(/\s+/).filter(segment => !/(hakuneko|electron)/i.test(segment)).join(' ');
        await app.whenReady();
        const win = await CreateApplicationWindow();
        const ipc = new IPC(win.webContents);
        const rpc = new RPCServer('/hakuneko', new RemoteProcedureCallContract(ipc, win.webContents));
        const uri = new URL(argv.origin ?? manifest.url ?? 'about:blank');
        UpdatePermissions(win.webContents.session, uri);
        new RemoteProcedureCallManager(rpc, ipc);
        new FetchProvider(ipc, win.webContents);
        new RemoteBrowserWindowController(ipc);
        new BloatGuard(ipc, win.webContents);
        win.RegisterChannels(ipc);

        // Fallback: Show window after 10 seconds if web app hasn't shown it
        // This ensures the window is visible even if the web app fails to load
        const showTimeout = setTimeout(() => {
            if(!win.isVisible() && !win.isDestroyed()) {
                console.warn('Web app did not show window within timeout, showing window as fallback');
                win.show();
            }
        }, 10000);

        // Clear timeout when web app loads successfully
        win.webContents.on('did-finish-load', () => {
            clearTimeout(showTimeout);
        });

        // Show window immediately if web app fails to load
        win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            clearTimeout(showTimeout);
            console.error(`Failed to load web app: [${errorCode}] ${errorDescription}`);
            if(!win.isVisible() && !win.isDestroyed()) {
                win.show();
            }
        });

        // Show window if renderer process crashes
        win.webContents.on('render-process-gone', (event, details) => {
            clearTimeout(showTimeout);
            console.error(`Renderer process gone: ${details.reason}`);
            if(!win.isVisible() && !win.isDestroyed()) {
                win.show();
            }
        });

        await win.loadURL(uri.href).catch(error => console.warn(error));
    } catch(error) {
        console.error(error);
        app.quit();
    }
}

OpenWindow();