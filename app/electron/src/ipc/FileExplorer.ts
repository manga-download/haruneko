import path from 'node:path';
import { spawn } from 'node:child_process';
import { shell, dialog } from 'electron';
import { FileExplorer as Channels } from '../../../src/ipc/Channels';
import type { IPC } from './InterProcessCommunication';

export class FileExplorer {

    constructor(ipc: IPC<string, string>) {
        ipc.Listen(Channels.App.ShowInFolder, this.ShowInFolder.bind(this));
        ipc.Listen(Channels.App.PickDirectory, this.PickDirectory.bind(this));
        ipc.Listen(Channels.App.PickFile, this.PickFile.bind(this));
        ipc.Listen(Channels.App.LaunchProgram, this.LaunchProgram.bind(this));
        ipc.Listen(Channels.App.OpenExternal, this.OpenExternal.bind(this));
    }

    private async ShowInFolder(folderPath: string): Promise<void> {
        await shell.openPath(path.normalize(folderPath));
    }

    private async PickDirectory(): Promise<string | null> {
        const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }
        return result.filePaths[0];
    }

    private async PickFile(): Promise<string | null> {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Executables', extensions: ['exe', 'app', 'sh', 'bat', 'cmd'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        });
        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }
        return result.filePaths[0];
    }

    private async LaunchProgram(program: string, folderPath: string): Promise<void> {
        const child = spawn(program, [path.normalize(folderPath)], {
            detached: true,
            stdio: 'ignore',
        });
        child.unref();
    }

    private async OpenExternal(url: string): Promise<void> {
        await shell.openExternal(url);
    }
}
