import path from 'node:path';
import { shell, dialog } from 'electron';
import { FileExplorer as Channels } from '../../../src/ipc/Channels';
import type { IPC } from './InterProcessCommunication';

export class FileExplorer {

    constructor(ipc: IPC<string, string>) {
        ipc.Listen(Channels.App.ShowInFolder, this.ShowInFolder.bind(this));
        ipc.Listen(Channels.App.PickDirectory, this.PickDirectory.bind(this));
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
}
