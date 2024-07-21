import type { StorageController } from '../StorageController';
import { ImageDirectoryExporter } from './ImageDirectoryExporter';
import { ComicBookArchiveExporter } from './ComicBookArchiveExporter';
import { ElectronicPublicationExporter } from './ElectronicPublicationExporter';
import { PortableDocumentFormatExporter } from './PortableDocumentFormatExporter';

export enum ChapterExportFormat {
    RAWs = 'image/*', // Save images from website in a folder
    PNGs = 'image/png', // Save images from website in a folder, convert non-PNG to PNG
    JPEGs = 'image/jpeg', // Save images from website in a folder, convert non-JPEG to JPEG
    WEBPs = 'image/webp', // Save images from website in a folder, convert non-WEBP to WEBP
    CBZ = 'application/x-cbz', // Save images from website in a zip-archive
    PDF = 'application/pdf', // Save images from website in a document, non-compliant images will be converted to JPEG @ q=95%
    EPUB = 'application/epub+zip', // Save images from website in a EPUB file
}

export function CreateChapterExportRegistry(storageController: StorageController) {
    return {
        [ChapterExportFormat.RAWs]: new ImageDirectoryExporter(storageController),
        [ChapterExportFormat.CBZ]: new ComicBookArchiveExporter(storageController),
        [ChapterExportFormat.PDF]: new PortableDocumentFormatExporter(storageController),
        [ChapterExportFormat.EPUB]: new ElectronicPublicationExporter(storageController),
    };
}