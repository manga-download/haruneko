import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

function MangaLabelExtractor(element: HTMLTitleElement) {
    return element.text.split(' - ')[0].trim();
}

@Common.MangaCSS(/^{origin}\/manga-[^/]+\.html$/, 'body title', MangaLabelExtractor)
@FlatManga.PagesSinglePageCSS('img.chapter-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangatr', `Manga-TR`, 'https://manga-tr.com', Tags.Language.Turkish, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(new URL('/manga-list.html', this.URI));
        return FetchWindowScript(request, `window.cookieStore.set('read_type', '1')`, 0, 30000);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return (await Common.FetchMangasSinglePageCSS.call(this, provider, '/manga-list.html', FlatManga.queryMangas)).filter(manga => manga.Title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }
    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]>{
        const mangaSlug = manga.Identifier.match(/manga-([^/]+)\.html/)[1];
        const url = new URL(`/cek/fetch_pages_manga.php?manga_cek=${mangaSlug}`, this.URI);
        const request = new Request(url, {
            method: 'POST',
            body: 'page=' + page,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-requested-with': 'XMLHttpRequest'
            }
        });

        const data = await FetchCSS<HTMLAnchorElement>(request, 'table.table tr td.table-bordered:first-of-type > a');
        return data.map(chapter => {
            const title = FlatManga.CleanTitle(chapter.text.replace(manga.Title, '')) || chapter.text.trim();
            return new Chapter(this, manga, chapter.pathname, title);
        });
    }

}