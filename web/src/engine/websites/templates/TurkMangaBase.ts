// TurkManga : artitrary name for turkish websites using NEXTJS chunks and series_items deshydrated page list

import type { Tag } from '../../Tags';
import { FetchNextJS } from '../../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type HydratedPages = {
    series_items: {
        path: string;
    }[];
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.content-info img', (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS('section[aria-label*="series"] div.card > div a:has(h2)', Common.PatternLinkGenerator('search?page={page}'))
@Common.ChaptersSinglePageCSS('div.list-episode a', undefined, (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.querySelector('.chapternum').textContent.trim() }))
@Common.ImageAjax()
export class TurkMangaBase extends DecoratableMangaScraper {

    public constructor(identifier: string, title: string, url: string, protected readonly cdnURL: string, ...tags: Tag[]) {
        super(identifier, title, url, ...tags);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { series_items } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'series_items' in data);
        return series_items.map(({ path }) => new Page(this, chapter, new URL(path, this.cdnURL), { Referer: this.URI.href }));
    }
}