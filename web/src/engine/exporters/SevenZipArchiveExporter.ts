import { MangaExporter } from './MangaExporter';
import { SanitizeFileName } from '../StorageController';
import { TaskPool, Priority } from '../taskpool/TaskPool';

import SevenZip from '7z-wasm';
import SevenZipURL from '7z-wasm/7zz.wasm?url'; // <-- Vite asset URL. Otherwise wasm is served as Mimetype text/html and fails


export class SevenZipArchiveExporter extends MangaExporter {

    public override async Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, chapterTitle: string, _mangaTitle?: string): Promise<void> {
        // Copied ImageDirectoryExporter to get images but stripped out all file writes
        const taskPool = new TaskPool(8);
        const digits = sourceFileList.size.toString().length;
        const folderName = SanitizeFileName(chapterTitle);
        const archiveName = `${folderName}.7z`;
        const promises = [...sourceFileList].map(([ index, tempfile ]) => taskPool.Add(
            () => super.ReadTempImageData(tempfile, index, digits)
            , Priority.Normal));
        const images = await Promise.all(promises);

        

        // Initialize 7z-wasm (locateFile is needed for proper loading)
        const sevenZip = await SevenZip({
            locateFile: (file: string) => {
                if (file.endsWith('.wasm')) return SevenZipURL;
                return file;
            }
        });

        // Prep virtual emspripten Input/Output directories
        sevenZip.FS.mkdir(`/${folderName}`);

        // Copy images to virtual FS
        for (const { name, data } of images) {
            const buffer = new Uint8Array(await data.arrayBuffer());
            const stream = sevenZip.FS.open(`/${folderName}/${name}`, 'w+');
            sevenZip.FS.write(stream, buffer, 0, buffer.length);
            sevenZip.FS.close(stream);
        }

        // Run 7z (Max compression mode without stacking algorithms)
        await sevenZip.callMain([
            'a',
            '-t7z',
            '-mx=9',
            '-myx=9',
            `/${archiveName}`,
            `/${folderName}`
        ]);

        // Read 7z archive from virtual FS
        const archiveData = new Uint8Array(sevenZip.FS.readFile(`/${archiveName}`));

        // Write archive to real FS
        const archiveHandle = await targetDirectory.getFileHandle(archiveName, { create: true });
        const writable = await archiveHandle.createWritable();
        try {
            await writable.write(archiveData);
        } finally {
            await writable.close();
        }

        // Cleanup virtual FS to free memory
        const filesInFolder = sevenZip.FS.readdir(`/${folderName}`).filter(f => f !== '.' && f !== '..'); // skip special entries
        for (const file of filesInFolder) {
            sevenZip.FS.unlink(`${`/${folderName}`}/${file}`);
        }
        sevenZip.FS.rmdir(`/${folderName}`);
        sevenZip.FS.unlink(`/${archiveName}`);
    }
}