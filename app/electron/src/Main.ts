import path from 'path';
import yargs from 'yargs';
import fs from 'fs/promises';
import { type BrowserWindow, app } from 'electron';
import { IPC } from './ipc/InterProcessCommunication';
import { ApplicationWindow } from './ipc/ApplicationWindow';
import { FetchProvider } from './ipc/FetchProvider';
import { InitializeMenu } from './Menu';
import { RemoteBrowserWindowController } from './ipc/RemoteBrowserWindow';
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// Need to use a dynamic import (only at build-time), so vite will correctly include the preload script in the build as code-splitted file
if(!process) import('./ipc/Preload');

type Manifest = {
    url: string;
    'user-agent': string;
};

async function LoadManifest(): Promise<Manifest> {
    const file = path.resolve(app.getAppPath(), 'package.json');
    const content = await fs.readFile(file, { encoding: 'utf-8' });
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

async function LaunchRenderer(manifest: Manifest): Promise<BrowserWindow> {
    const win = new ApplicationWindow({
        show: false,
        width: 1280,
        height: 720,
        center: true,
        frame: false,
        transparent: true,
        //icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
        webPreferences: {
            webSecurity: false, // Bypass CORS checks
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.resolve(app.getAppPath(), 'preload.js'),
            disableBlinkFeatures: 'AutomationControlled',
        },
    });
    win.removeMenu();
    win.setMenu(null);
    win.setMenuBarVisibility(false);

    await win.loadURL(await GetArgumentURL() ?? manifest.url, {
        userAgent: manifest['user-agent'] ?? win.webContents.userAgent.replace(/\s+[^\s]*(hakuneko|electron)[^\s]*\s+/gi, ' '),
    });

    return win;
}

async function RegisterRendererCallbacks(win: BrowserWindow) {
    new IPC();
    new FetchProvider(win.webContents);
    new RemoteBrowserWindowController();
}

app.on('window-all-closed', () => app.quit());
InitializeMenu();
app.whenReady()
    .then(LoadManifest)
    .then(LaunchRenderer)
    .then(RegisterRendererCallbacks);