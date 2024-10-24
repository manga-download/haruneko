import path from 'path';
import yargs from 'yargs';
import fs from 'fs/promises';
import { app } from 'electron';
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

async function GetArgumentURL(): Promise<string | undefined> {
    try {
        const argv = await yargs(process.argv).argv;
        return argv.origin as string;
    } catch {
        return undefined;
    }
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

async function OpenWindow(): Promise<void> {
    InitializeMenu();
    const manifest = await LoadManifest();
    await SetupUserDataDirectory(manifest);
    app.userAgentFallback = manifest['user-agent'] ?? app.userAgentFallback.split(/\s+/).filter(segment => !/(hakuneko|electron)/i.test(segment)).join(' ');
    await app.whenReady();
    const win = await CreateApplicationWindow();
    const ipc = new IPC(win.webContents);
    const rpc = new RPCServer('/hakuneko', new RemoteProcedureCallContract(ipc, win.webContents));
    new RemoteProcedureCallManager(rpc, ipc);
    new FetchProvider(ipc, win.webContents);
    new RemoteBrowserWindowController(ipc);
    new BloatGuard(ipc, win.webContents);
    win.RegisterChannels(ipc);
    return win.loadURL(await GetArgumentURL() ?? manifest.url);
}

OpenWindow();