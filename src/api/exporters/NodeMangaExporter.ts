import { type StorageController } from '../../engine/StorageController.js';

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

/**
 * Base class for Node.js-compatible manga exporters
 * Unlike the browser exporters, these work with Node.js filesystem APIs
 */
export abstract class NodeMangaExporter {

    constructor(protected readonly storageController: StorageController) {}

    protected async ReadTempImageData(file: string, index: number, digits: number): Promise<{ name: string, data: Blob }> {
        const data = await this.storageController.LoadTemporary<Blob>(file);
        const extension: string = mimeFileExtension[data.type] ?? mimeFileExtension.default;
        const name = (index + 1).toString().padStart(digits, '0') + extension;
        return { name, data };
    }

    /**
     * Export manga chapter to the specified file path
     * @param sourceFileList Map of image indices to temporary file keys
     * @param outputPath Full path to the output file or directory
     * @param chapterTitle Title of the chapter
     * @param mangaTitle Optional title of the manga series
     */
    public abstract Export(sourceFileList: Map<number, string>, outputPath: string, chapterTitle: string, mangaTitle?: string): Promise<void>;
}
