import { Tags } from '../Tags';
import icon from './Qimeitj.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MH from './templates/MH';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manhua\/[^/]+$/, MH.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(MH.queryMangas, MH.MangasLinkGenerator)
@Common.ChaptersSinglePageCSS(MH.queryChapters, undefined, MH.ChapterExtractor, true)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('qimeitj', `Qimeitj`, 'https://hxy4.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier, this.URI);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                url.searchParams.set('page', `${page}`);
                const data = await FetchCSS<HTMLImageElement>(new Request(url), MH.queryPages);
                const pages = data.map(element => new Page(this, chapter, new URL(MH.PageLinkExtractor.call(this, element))));
                yield* pages;
                run = pages.length > 0;
            }
        }.call(this));
    }
}