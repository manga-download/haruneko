import JSZip from 'jszip';
import { MangaExporter } from './MangaExporter';
import { SanitizeFileName } from '../StorageController';

export class ComicBookArchiveExporter extends MangaExporter {

    private readonly xmlParser = new DOMParser();
    private readonly xmlSerializer = new XMLSerializer();

    private CreateComicInfo(title: string, series: string) {
        const xml = this.xmlParser.parseFromString(`<?xml version="1.0" encoding="UTF-8"?>
            <ComicInfo>
                <Title></Title>
                <Series></Series>
            </ComicInfo>
        `, 'text/xml');

        xml.querySelector('Title').textContent = title;
        xml.querySelector('Series').textContent = series;

        return this.xmlSerializer.serializeToString(xml);
    }

    public override async Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, chapterTitle: string, mangaTitle?: string): Promise<void> {
        const zip = new JSZip();
        const digits = sourceFileList.size.toString().length;

        zip.file('ComicInfo.xml', this.CreateComicInfo(chapterTitle, mangaTitle ?? chapterTitle), { compression: 'DEFLATE' });

        for(const [ index, tempfile ] of sourceFileList) {
            const { name, data } = await super.ReadTempImageData(tempfile, index, digits);
            zip.file(name, data, { compression: 'STORE' });
        }

        const file = await targetDirectory.getFileHandle(SanitizeFileName(chapterTitle + '.cbz'), { create: true });
        const stream = await file.createWritable();
        await stream.write(await zip.generateAsync({ type: 'blob' }));
        await stream.close();
    }
}