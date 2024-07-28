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
                // Conversion of unsupported images via jsPDF is slow and produces a large PDF => Using own implementation of image conversion
                const blob = pdfImageFormats.includes(data.type) ? data : await ConvertBitmap(bitmap, 'image/jpeg', 0.95);
                return { width, height, data: new Uint8Array(await blob.arrayBuffer()) };
            } finally {
                bitmap.close();
            }
        }, Priority.Normal));
        return Promise.all(promises);
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