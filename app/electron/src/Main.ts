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
    'chromium-args': undefined | string;
};

async function LoadManifest(): Promise<Manifest> {
    const file = path.resolve(app.getAppPath(), 'package.json');
    const content = await fs.readFile(path.normalize(file), { encoding: 'utf-8' });
    return JSON.parse(content) as Manifest;
}

async function SetupUserDataDirectory(manifest: Manifest): Promise<void> {
    // TODO: This detection is more like a hack and does not use the provided path
    if(manifest['chromium-args']?.includes('--user-data-dir=userdata')) {
        app.setPath('userData', path.resolve(path.dirname(app.getPath('exe')), 'userdata'));
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
            backgroundThrottling: false,
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

function CheckHostPermission(url: string, hostname: string) {
    try {
        return new URL(url).hostname === hostname;
    } catch {
        return false;
    }
}

function UpdatePermissions(session: Electron.Session, appURI: URL) {
    session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => CheckHostPermission(requestingOrigin, appURI.hostname));
    session.setPermissionRequestHandler((webContents, permission, callback, details) => callback(CheckHostPermission(details.requestingUrl, appURI.hostname)));
    // TODO: May remove the following workaround when https://github.com/electron/electron/issues/41957 is solved
    session.on('file-system-access-restricted', (event, details, callback) => callback(CheckHostPermission(details.origin, appURI.hostname) ? 'allow' : 'deny'));
}

async function OpenWindow(): Promise<void> {
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
    return win.loadURL(uri.href);
}

OpenWindow();