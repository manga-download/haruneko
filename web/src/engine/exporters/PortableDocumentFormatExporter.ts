import jsPDF from 'jspdf';
import { MangaExporter } from './MangaExporter';
import { SanitizeFileName } from '../StorageController';
import { Priority, TaskPool } from '../taskpool/TaskPool';
import { ConvertBitmap } from '../transformers/ImageConverter';

const pdfImageFormats = [ 'image/png', 'image/jpeg' ];
const pageWidth = 2400; // (W)QUXGA - Portrait

export class PortableDocumentFormatExporter extends MangaExporter {

    private async PrepareImages(sourceFileList: Map<number, string>) {
        const taskPool = new TaskPool(8);
        const digits = sourceFileList.size.toString().length;
        const promises = new Array(sourceFileList.size).fill(null).map((_, index) => taskPool.Add(async () => {
            const { data } = await super.ReadTempImageData(sourceFileList.get(index), index, digits);
            const bitmap = await createImageBitmap(data);
            try {
                const { width, height } = bitmap;
                let blob = data;
                // Conversion of unsupported images via jsPDF is slow and produces a large PDF => Using own implementation of image conversion
                if (!pdfImageFormats.includes(data.type)) {
                    blob = await ConvertBitmap(bitmap, 'image/jpeg', 0.95);
                } else {
                    blob = data.type === 'image/jpeg' && await this.IsCompatibleJPEG(data) ? blob : await ConvertBitmap(bitmap, 'image/jpeg', 0.95);
                }
                return { width, height, data: new Uint8Array(await blob.arrayBuffer()) };
            } finally {
                bitmap.close();
            }
        }, Priority.Normal));
        return Promise.all(promises);
    }

    /**
     * Test if JPEG data is compatible with JsPDF "headers check"
     * @param data - A Blob of the image
     * @returns
     */
    private async IsCompatibleJPEG(data: Blob): Promise<boolean> {
        const imageData = new Uint8Array(await data.arrayBuffer());
        let result = true;
        const jsPdfJpegHeaders =
            [[0xff, 0xd8, 0xff, 0xe0, undefined, undefined, 0x4a, 0x46, 0x49, 0x46, 0x00], //JFIF
                [0xff, 0xd8, 0xff, 0xe1, undefined, undefined, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00], //Exif
                [0xff, 0xd8, 0xff, 0xdb], //JPEG RAW
                [0xff, 0xd8, 0xff, 0xee] //EXIF RAW
            ];

        for (let i = 0; i < jsPdfJpegHeaders.length; i += 1) {
            let pattern = jsPdfJpegHeaders[i];
            result = true;

            for (let j = 0; j < pattern.length; j += 1) {
                if (pattern[j] == undefined) continue;

                if (pattern[j] !== imageData[j]) {
                    result = false;
                    break;
                }
            }
            if (result) break;
        }
        return result;
    }

    public async Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, targetBaseName: string): Promise<void> {
        const pdf = new jsPDF({ unit: 'px' });
        pdf.deletePage(1);

        for(const { width, height, data } of await this.PrepareImages(sourceFileList)) {
            const pageHeight = height * pageWidth / width;
            pdf.addPage([ pageWidth, pageHeight ], pageWidth < pageHeight ? 'portrait': 'landscape');
            pdf.addImage(data, 0, 0, pageWidth, pageHeight);
        }

        const file = await targetDirectory.getFileHandle(SanitizeFileName(targetBaseName + '.pdf'), { create: true });
        const stream = await file.createWritable();
        await stream.write(pdf.output('blob'));
        await stream.close();
    }
}