import PDFDocument from 'pdfkit';
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
                return {
                    width: bitmap.width,
                    height: bitmap.height,
                    // Conversion of unsupported images via jsPDF is slow and produces a large PDF => Using own implementation of image conversion
                    data: pdfImageFormats.includes(data.type) ? data : await ConvertBitmap(bitmap, 'image/jpeg', 0.95)
                };
            } finally {
                bitmap.close();
            }
        }, Priority.Normal));
        return Promise.all(promises);
    }

    public async Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, targetBaseName: string): Promise<void> {
        const file = await targetDirectory.getFileHandle(SanitizeFileName(targetBaseName + '.pdf'), { create: true });
        const stream = await file.createWritable();
        const pdf = new PDFDocument({
            autoFirstPage: false,
            compress: false,
            margin: 0,
        });
        pdf.on('data', (bytes: Uint8Array) => stream.write(bytes));
        pdf.once('error', () => stream.close());
        pdf.once('end', () => stream.close());

        for(const { width, height, data } of await this.PrepareImages(sourceFileList)) {
            const pageHeight = height * pageWidth / width;
            pdf.addPage({
                layout: pageWidth < pageHeight ? 'portrait': 'landscape',
                size: [ pageWidth, pageHeight ],
                margin: 0,
            }).image(await data.arrayBuffer(), {
                fit: [ pageWidth, pageHeight ],
                valign: 'center',
                align: 'center',
            });
        }

        pdf.end();
    }
}