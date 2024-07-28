import { Tags } from '../Tags';
import icon from './Qimeitj.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MH from './templates/MH';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/book\/[^/]+$/, MH.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(MH.mangaPath, MH.queryMangas)
@Common.ChaptersSinglePageCSS(MH.queryChapters, MH.ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('qimeitj', `Qimeitj`, 'https://qimeitj.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pagesList: Page[] = [];
        for (let page = 1, run = true; run; page++) {
            const pages = await this.GetPagesFromChapterPage(page, chapter);
            pages.length > 0 ? pagesList.push(...pages) : run = false;
        }
        return pagesList;
    }

    private async GetPagesFromChapterPage(page: number, chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier, this.URI);
        url.searchParams.set('page', page.toString());
        const data = await FetchCSS<HTMLImageElement>(new Request(url), MH.queryPages);
        return data.map(element => {
            const link = MH.PageLinkExtractor.call(this, element);
            return new Page(this, chapter, new URL(link));
        });
    }
}