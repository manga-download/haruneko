import { Tags } from '../Tags';
import icon from './LELScanVF.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaLabelExtractor(element: HTMLImageElement): string {
    return element.alt.trim();
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLImageElement>('img').getAttribute('alt').trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'section img.object-cover', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/manga?page={page}', 'div#card-real a', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageCSS('div#chapter-container img.chapter-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelscanvf', `LELSCAN-VF`, 'https://lelscanfr.com', Tags.Language.French, Tags.Media.Manga, Tags.Source.Aggregator);
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
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier}?page=${page}`, this.URI)), 'div#chapters-list a');
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('span').textContent.trim()));
    }
}