import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('/manga/page/{page}/', 'div.manga-block h3 a.uk-link-heading')
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-content img[data-original-src]')].map(img => img.dataset.originalSrc);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('merlinscans', 'Merlin Scans', 'https://merlintoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier}chapter/page/${page}/`, this.URI)), 'div.chapter-item a');
        return elements.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.querySelector<HTMLHeadingElement>('h3.uk-link-heading').textContent.trim().replace(/^.*\s*–\s*Bölüm/, 'Bölüm')));
    }
}