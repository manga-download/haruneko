import { Tags } from '../Tags';
import icon from './FlixScansOrg.webp';
import { Manga, type MangaPlugin, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import { categories } from './GalaxyManga';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span').textContent.trim()
    };
}

@Common.ChaptersSinglePageCSS('div.grid a[wire\\:key]:not(.btn)', ChapterExtractor)
@Common.PagesSinglePageCSS('div[wire\\:key*="image"] img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('flixscansorg', 'FlixScans (.org)', 'https://flixscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (const category of categories) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.GetMangasFromCategoryPage(page, provider, category);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return mangaList;
    }

    private async GetMangasFromCategoryPage(page: number, provider: MangaPlugin, category: string): Promise<Manga[]> {
        //document.querySelectorAll('div[wire\\:snapshot][wire\\:effects*="paginators"]')
        const uri = new URL(`/webtoons/${category}/latest?page=${page}`, this.URI);
        const data = await FetchCSS<HTMLAnchorElement>(new Request(uri), 'div.grid div[wire\\:effects="[]"] div div div a');
        return data.map(element => new Manga(this, provider, element.pathname, element.text.trim()));
    }

    /*
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const matches = url.match(this.mangaRegexp);
        const request = new Request(`${this.apiUrl}webtoon/series/${matches[2]}/${matches[1]}`);
        const { serie } = await FetchJSON<APIMangaClipboard>(request);
        return new Manga(this, provider, JSON.stringify(<APIManga>{
            id: serie.id,
            prefix: serie.prefix
        }), serie.title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaID: APIManga = JSON.parse(manga.Identifier);
        const request = new Request(`${this.apiUrl}webtoon/chapters/${mangaID.id}-desc`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => new Chapter(this, manga, chapter.id.toString(), `${chapter.name} ${chapter.title || ''}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaID: APIManga = JSON.parse(chapter.Parent.Identifier);
        const request = new Request(`${this.apiUrl}webtoon/chapters/chapter/${chapter.Identifier}/${mangaID.prefix}`);
        const data = await FetchJSON<APIPages>(request);
        return data.chapter.chapterData.webtoon.map(image => new Page(this, chapter, new URL(image, this.cdnUrl)));
    }
    */
}