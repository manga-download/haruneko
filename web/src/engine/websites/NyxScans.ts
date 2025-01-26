import { Tags } from '../Tags';
import icon from './NyxScans.webp';
import { FetchRegex } from '../platform/FetchProvider';
import { Page, type Chapter } from '../providers/MangaPlugin';
import { VTheme } from './templates/VTheme';

type JSONImage = {
    url: string
}

export default class extends VTheme {

    public constructor() {
        super('nyxscans', 'Nyx Scans', 'https://nyxscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator );
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [data] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /\\"images\\":(\[.*]),\\"nextChapter/g);
        const images: JSONImage[] = JSON.parse(data.replaceAll('\\', ''));
        return images.map(image => new Page(this, chapter, new URL(image.url), { Referer: this.URI.href }));
    }
}