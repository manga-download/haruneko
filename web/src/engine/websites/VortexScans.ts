import { Tags } from '../Tags';
import { FetchHTML } from '../platform/FetchProvider';
import { Page, type Chapter } from '../providers/MangaPlugin';
import icon from './VortexScans.webp';
import { VTheme } from './templates/VTheme';

type JSONImage = {
    url: string
}

export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator );
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const doc = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        const images: JSONImage[] = JSON.parse(doc.documentElement.innerHTML.match(/\\"images\\":(\[.*]),\\"nextChapter/)[1].replaceAll('\\', ''));
        return images.map(image => new Page(this, chapter, new URL(image.url), { Referer: this.URI.href }));
    }
}
