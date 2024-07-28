import JSZip from 'jszip';
import { MangaExporter } from './MangaExporter';
import { SanitizeFileName } from '../StorageController';

export class ComicBookArchiveExporter extends MangaExporter {

    public async Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, targetBaseName: string): Promise<void> {
        const zip = new JSZip();
        const digits = sourceFileList.size.toString().length;

        for(const [ index, tempfile ] of sourceFileList) {
            const { name, data } = await super.ReadTempImageData(tempfile, index, digits);
            zip.file(name, data, { compression: 'STORE' });
        }

        const file = await targetDirectory.getFileHandle(SanitizeFileName(targetBaseName + '.cbz'), { create: true });
        const stream = await file.createWritable();
        await stream.write(await zip.generateAsync({ type: 'blob' }));
        await stream.close();
    }
}