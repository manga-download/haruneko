//based on NIADD && NovelCool
import { FetchCSS } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga, type Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from '../decorators/Common';

function CleanTitle(title: string): string {
    return title.replace(/(^\s*[Мм]анга|[Mm]anga\s*$)/, '').trim();
};

@Common.MangaCSS(/^{origin}\/[^/]+\/[^/]+\.html/, 'h1.book-headline-name, h1.bookinfo-title', (element, uri) => ({ id: uri.pathname, title: CleanTitle(element.textContent) }))
@Common.MangasMultiPageCSS('div.manga-list td.manga-part > a, div.book-item', Common.PatternLinkGenerator('/search/?completed_series=either&page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(`
    new Promise( resolve => {
        if (document.querySelector('.chapter-reading-section')) {
            //Novel - no pictures;
            resolve([]);
            return;
        }

        if (window.NiaddChpPageCtrl) {
            resolve(NiaddChpPageCtrl.options.all_imgs_url);
            return;
        }

        let pages = [...document.querySelectorAll('div[option_name="page_head"] div.chp-selection-item')].map(option => option.getAttribute('option_val')+ '#HTML');
        if (pages.length === 0) pages = [...document.querySelectorAll('select.sl-page option')].map(option => option.value+ '#HTML');

        resolve(pages);
    })`, 2500)
export class NineMangaBase extends DecoratableMangaScraper {
    private chapterOnMangaPage = false;

    public ChaptersOnMangaPage(): NineMangaBase {
        this.chapterOnMangaPage = true;
        return this;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const link = new URL(!this.chapterOnMangaPage ? `${manga.Identifier.replace(/\.html$/, '/chapters.html')}` : manga.Identifier, this.URI);
        const chapters = await FetchCSS<HTMLAnchorElement>(new Request(link), 'ul.chapter-list > a, div.chp-item a');
        return chapters.map(({ pathname, href, search, title }) => {
            const link = !search ? pathname : href;
            return new Chapter(this, manga, link, title.replace(manga.Title, '').replace(/^\s*:/, '').trim() || title);
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (page.Link.hash === '#HTML') {
            return Common.FetchImageAjaxFromHTML.call(this, page, priority, signal, 'img.manga_pic');
        } else return Common.FetchImageAjax.call(this, page, priority, signal);
    }
}