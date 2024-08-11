import { Tags } from '../Tags';
import icon from './Alphapolis.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (render) => {
    const dom = await render();
    return dom.documentElement.innerHTML.includes('window.awsWafCookieDomainList') ? FetchRedirection.Automatic : undefined;
});

function ChaptersExtractor(element: HTMLElement) {
    const id = element instanceof HTMLAnchorElement ? element.pathname : element.querySelector<HTMLAnchorElement>('a.read-episode').pathname;
    const title = element.querySelector('.title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\/(official|\d+)\/\d+/, 'div.manga-detail-description > div.title, div.content-main > h1.title')
@Common.ChaptersSinglePageCSS('div.episode-unit, div.episodes div.episode a', ChaptersExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alphapolis', `ALPHAPOLIS (アルファポリス)`, 'https://www.alphapolis.co.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const results: Manga[] = [];
        for (const character of '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, `/search?category=official_manga&query=${character}&page={page}`, 'div.mangas-list div.wrap div.title a', 1, 1, 500);
            results.push(...mangas);
        }
        results.push(...await Common.FetchMangasMultiPageCSS.call(this, provider, '/manga/index?sort=title&limit=1000&page={page}', 'div.content-main div.content-title a', 1, 1, 500));
        return results.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let viewer: HTMLElement = undefined;
        try {
            [viewer] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), '[v-bind\\:pages]');
        } catch { // TODO: Do not use same message for generic errors
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const links: unknown[] = JSON.parse(viewer.getAttribute('v-bind:pages'));
        const isVertical = viewer.getAttribute('v-bind:is-vertical-manga') === '1';
        return (links
            .filter(link => link && typeof link === 'string' && !/white_page/.test(link)) as string[])
            .map(link => {
                const uri = new URL(isVertical ? link : link.replace(/\/[0-9]+x[0-9]+/, '/1080x1536'));
                return new Page(this, chapter, uri, isVertical ? null : { fallbackURL: link });
            });
    }

    //Since high resolution is not always available, use the real picture url instead of the forces one in case of failure
    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            try {
                const request = new Request(page.Link, {
                    signal: signal,
                    headers: {
                        Referer: this.URI.href
                    }
                });
                const response = await Fetch(request);
                return response.blob();
            } catch (error) {

                if (page.Parameters.fallbackURL) {
                    const request = new Request(page.Parameters.fallbackURL as string, {
                        signal: signal,
                        headers: {
                            Referer: this.URI.href
                        }
                    });
                    const response = await Fetch(request);
                    return response.blob();
                } else Promise.reject(error);
            }
        }, priority, signal);
    }
}