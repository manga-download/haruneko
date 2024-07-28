import { MangaExporter } from './MangaExporter';
import { SanitizeFileName } from '../StorageController';
import { TaskPool, Priority } from '../taskpool/TaskPool';

export class ImageDirectoryExporter extends MangaExporter {

    public async Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, targetBaseName: string): Promise<void> {
        const taskPool = new TaskPool(8);
        const digits = sourceFileList.size.toString().length;
        const directory = await targetDirectory.getDirectoryHandle(SanitizeFileName(targetBaseName), { create: true });

        // TODO: delete all existing entries?
        const promises = [...sourceFileList].map(([ index, tempfile ]) => taskPool.Add(async () => {
            const { name, data } = await super.ReadTempImageData(tempfile, index, digits);
            const file = await directory.getFileHandle(name, { create: true });
            const stream = await file.createWritable();
            try {
                await stream.write(data);
            } finally {
                await stream.close();
            }
        }, Priority.Normal));

        await Promise.all(promises);
    }
}