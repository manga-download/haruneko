import { Tags } from '../Tags';
import icon from './Bacami.webp';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'div.manga-details h1.manga-title')
@MangaStream.MangasSinglePageCSS('ul li a.series', '/daftar-komik/')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.ch-link', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.text.split(' – ').at(-1).trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacami', 'Bacami', 'https://v1.bacami.site', Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [data] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /imageUrls\s*:\s*(\[[\s\S]*?\])/g);
        return (<string[]>JSON.parse(data)).map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }
}