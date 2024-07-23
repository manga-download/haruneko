import { type StorageController } from '../StorageController';

// See: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const mimeFileExtension = {
    default: '.bin',
    'image/avif': '.avif',
    'image/webp': '.webp',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
};

export abstract class MangaExporter {

    constructor(private readonly storageController: StorageController) {}

    protected async ReadTempImageData(file: string, index: number, digits: number): Promise<{ name: string, data: Blob }> {
        const data = await this.storageController.LoadTemporary<Blob>(file);
        const extension: string = mimeFileExtension[data.type] ?? mimeFileExtension.default;
        const name = (index + 1).toString().padStart(digits, '0') + extension;
        return { name, data };
    }

    public abstract Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, targetBaseName: string): Promise<void>;
}