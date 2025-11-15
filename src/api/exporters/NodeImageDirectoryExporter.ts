import { promises as fs } from 'fs';
import path from 'path';
import { NodeMangaExporter } from './NodeMangaExporter.js';

/**
 * Node.js-compatible image directory exporter
 * Exports manga pages as individual image files in a directory
 */
export class NodeImageDirectoryExporter extends NodeMangaExporter {

    public override async Export(sourceFileList: Map<number, string>, outputPath: string, _chapterTitle: string, _mangaTitle?: string): Promise<void> {
        const digits = sourceFileList.size.toString().length;

        // Ensure the output directory exists
        await fs.mkdir(outputPath, { recursive: true });

        // Save all images to the directory
        const entries = Array.from(sourceFileList.entries());
        const promises = entries.map(async ([index, tempfile]) => {
            const { name, data } = await super.ReadTempImageData(tempfile, index, digits);
            const filePath = path.join(outputPath, name);
            const buffer = Buffer.from(await data.arrayBuffer());
            await fs.writeFile(filePath, buffer);
        });

        await Promise.all(promises);
    }
}
