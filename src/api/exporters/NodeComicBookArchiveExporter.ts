import JSZip from 'jszip';
import { promises as fs } from 'fs';
import { NodeMangaExporter } from './NodeMangaExporter.js';

/**
 * Node.js-compatible CBZ exporter
 * Creates Comic Book Archive files (.cbz) with ComicInfo.xml metadata
 */
export class NodeComicBookArchiveExporter extends NodeMangaExporter {

    private CreateComicInfo(title: string, series: string): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<ComicInfo>
    <Title>${this.escapeXml(title)}</Title>
    <Series>${this.escapeXml(series)}</Series>
</ComicInfo>`;
    }

    private escapeXml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    public override async Export(sourceFileList: Map<number, string>, outputPath: string, chapterTitle: string, mangaTitle?: string): Promise<void> {
        const zip = new JSZip();
        const digits = sourceFileList.size.toString().length;

        // Add ComicInfo.xml metadata
        zip.file('ComicInfo.xml', this.CreateComicInfo(chapterTitle, mangaTitle ?? chapterTitle), { compression: 'DEFLATE' });

        // Add all images to the archive
        const entries = Array.from(sourceFileList.entries());
        for (const [index, tempfile] of entries) {
            const { name, data } = await super.ReadTempImageData(tempfile, index, digits);
            const buffer = Buffer.from(await data.arrayBuffer());
            zip.file(name, buffer, { compression: 'STORE' });
        }

        // Generate and save the CBZ file
        const content = await zip.generateAsync({ type: 'nodebuffer' });
        await fs.writeFile(outputPath, content);
    }
}
