//TurkManga : artitrary name for turkish websites using NEXTJS chunks and series_items deshydrated page list

import { FetchNextJS } from '../../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('.chapternum').textContent.trim()
    };
}

type HydratedPages = {
    series_items: {
        path: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.content-info img', (element: HTMLImageElement) => element.alt.trim())
@Common.MangasMultiPageCSS('search?page={page}', 'section[aria-label*="series"] div.card > div a:has(h2)')
@Common.ChaptersSinglePageCSS('div.list-episode a', ChapterExtractor)
@Common.ImageAjax()
export class TurkMangaBase extends DecoratableMangaScraper {
    protected cdnUrl = 'https://manga1.efsaneler.can.re/';

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { series_items } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'series_items' in data);
        return series_items.map(({ path }) => new Page(this, chapter, new URL(path, this.cdnUrl), { Referer: this.URI.href }));
    }
}