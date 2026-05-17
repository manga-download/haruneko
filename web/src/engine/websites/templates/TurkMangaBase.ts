// TurkManga : arbitrary name for turkish websites using NEXTJS chunks and series_items deshydrated page list

import type { Tag } from '../../Tags';
import { AddAntiScrapingDetection, FetchRedirection } from '../../platform/AntiScrapingDetection';
import { FetchNextJS } from '../../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type HydratedPages = {
    series_items: {
        path: string;
    }[];
};

const DetectSecurityShield: Parameters<typeof AddAntiScrapingDetection>[0] = async invoke => {
    const result = await invoke<boolean>(`document.title === 'Security Verification' && document.querySelector('div.shield-container') && true || false;`);
    return result ? FetchRedirection.Automatic : undefined;
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.content-info img', (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS('section[aria-label*="series"] div.card > div a:has(h2)', Common.PatternLinkGenerator('./search?page={page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.list-episode a', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('.chapternum').textContent.trim() }))
@Common.ChapterURL()
@Common.ImageAjax()
export class TurkMangaBase extends DecoratableMangaScraper {

    #cdnURL: string = undefined;

    constructor(identifier: string, title: string, url: string, ...tags: Tag[]) {
        super(identifier, title, url, ...tags);
        AddAntiScrapingDetection(DetectSecurityShield, new RegExp(this.URI.origin));
    }

    protected WithCDN(url: string) {
        this.#cdnURL = url;
        return this;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { series_items } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'series_items' in data);
        return series_items.map(({ path }) => new Page(this, chapter, new URL(path, this.#cdnURL), { Referer: this.URI.href }));
    }
}