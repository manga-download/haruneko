//based on NIADD & NovelCool

import { FetchCSS, FetchWindowScript } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from '../decorators/Common';

function CleanTitle(title: string): string {
    return title.replace(/(^\s*[Мм]анга|[Mm]anga\s*$)/, '').trim();
};

@Common.MangaCSS(/^{origin}\/[^/]+\/[^/]+\.html/, 'h1.book-headline-name, h1.bookinfo-title', (element, uri) => ({ id: uri.pathname, title: CleanTitle(element.textContent) }))
@Common.MangasMultiPageCSS('div.manga-list td.manga-part > a, div.book-item', Common.PatternLinkGenerator('/search/?completed_series=either&page={page}'), 0, Common.AnchorInfoExtractor(true))

export class NiaddBase extends DecoratableMangaScraper {
    private isNovelWebsite = false;

    public IsNovelWebsite(): NiaddBase {
        this.isNovelWebsite = true;
        return this;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const link = new URL(!this.isNovelWebsite ? `${manga.Identifier.replace(/\.html$/, '/chapters.html')}` : manga.Identifier, this.URI);
        const chapters = await FetchCSS<HTMLAnchorElement>(new Request(link), 'ul.chapter-list > a, div.chp-item a');
        return chapters.map(({ pathname, href, search, title }) => {
            const link = !search ? pathname : href;
            return new Chapter(this, manga, link, title.replace(manga.Title, '').replace(/^\s*:/, '').trim() || title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        //NORMAL WAY (Niadd & NovelCool): Pages are wrapped in html pages
        if (/^\/chapter\//.test(chapter.Identifier)) {
            const selector = [
                'div[option_name="page_head"] div.chp-selection-item',
                'select.sl-page option'
            ].join(',');
            return Common.FetchPagesSinglePageCSS.call(this, chapter, selector, element => element instanceof HTMLOptionElement ? element.value : element.getAttribute('option_val'));
        }

        //EXCEPTIONS : EN & ES. For both websites types.
        const pages = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI), {
            headers: {
                Referer: undefined
            }
        }), `
            new Promise(resolve => {
                if (document.querySelector('.chapter-reading-section')) {
                    //Novel - no pictures;
                    resolve([]);
                    return;
                }

                if (window.NiaddChpPageCtrl) {
                    resolve(NiaddChpPageCtrl.options.all_imgs_url);
                    return;
                }

                let pages = [...document.querySelectorAll('div[option_name="page_head"] div.chp-selection-item')].map(option => option.getAttribute('option_val'));
                if (pages.length === 0) pages = [...document.querySelectorAll('select.sl-page option')].map(option => option.value);

                resolve(pages);
            });
        `, 1500);
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (page.Link.href.endsWith('.html')) {
            const image = await this.imageTaskPool.Add(async () => {
                const request = new Request(page.Link.href, {
                    signal: signal,
                    headers: {
                        Referer: undefined,
                    }
                });
                const realimage = (await FetchCSS<HTMLImageElement>(request, 'img.manga_pic'))[0].getAttribute('src');
                const parameters = page.Parameters?.Referer ? { Referer: page.Parameters?.Referer } : { Referer: page.Link.origin };
                return new Page(this, page.Parent as Chapter, new URL(realimage, request.url), parameters);
            }, priority, signal);

            return await Common.FetchImageAjax.call(this, image, priority, signal);

        } else return Common.FetchImageAjax.call(this, page, priority, signal);
    }
}