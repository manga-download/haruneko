import type { StorageController } from '../StorageController';
import { ImageDirectoryExporter } from './ImageDirectoryExporter';
import { ComicBookArchiveExporter } from './ComicBookArchiveExporter';
import { ElectronicPublicationExporter } from './ElectronicPublicationExporter';
import { PortableDocumentFormatExporter } from './PortableDocumentFormatExporter';

export enum MangaExportFormat {
    /**
     * Save images from website in a folder
     */
    RAWs = 'image/*',
    /**
     * Save images from website in a folder, convert non-PNG to PNG
     */
    PNGs = 'image/png',
    /**
     * Save images from website in a folder, convert non-JPEG to JPEG
     */
    JPEGs = 'image/jpeg',
    /**
     * Save images from website in a folder, convert non-WEBP to WEBP
     */
    WEBPs = 'image/webp',
    /**
     * Save images from website in a zip-archive
     */
    CBZ = 'application/x-cbz',
    /**
     * Save images from website in a EPUB file
     */
    EPUB = 'application/epub+zip',
    /**
     * Save images from website in a document, non-compliant images will be converted to JPEG @ q=95%
     */
    PDF = 'application/pdf',
}

export function CreateChapterExportRegistry(storageController: StorageController) {
    return {
        [MangaExportFormat.RAWs]: new ImageDirectoryExporter(storageController),
        [MangaExportFormat.CBZ]: new ComicBookArchiveExporter(storageController),
        [MangaExportFormat.PDF]: new PortableDocumentFormatExporter(storageController),
        [MangaExportFormat.EPUB]: new ElectronicPublicationExporter(storageController),
    };
}