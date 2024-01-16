import { Tags } from '../Tags';
import icon from './MangaYeh.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowCSS } from '../platform/FetchProvider';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('div.mtitle').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga-info\//, 'div.content h1.title')
@Common.MangasMultiPageCSS('/category/all?page={page}', 'div.media-content div.content > a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('#chapterList td:nth-child(1) a')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangayeh', `MangaYeh`, 'https://w13.mangayeh.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier, this.URI).href;
        const request = new Request(url);
        const data = await FetchWindowCSS<HTMLImageElement>(request, '.container p img[data-src]', 2500);
        return data.map(page => new Page(this, chapter, new URL(page.dataset['src'])));

    }
}