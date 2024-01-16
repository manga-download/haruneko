import { Tags } from '../Tags';
import icon from './ReaperScansBR.webp';
import { Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

function MangaLabelExtractor(element: HTMLElement) {
    return element.textContent.split(' - ')[0].trim();
}

type JSONMangas = {
    data: { id: number, title: string, series_slug : string}[]
}

type APISeasons = {
    seasons : APISeason[]
}

type APISeason = {
    chapters: APIChapter[]
}

type APIChapter = {
    chapter_name: string,
    chapter_slug: string
    id: number
}

type APIPages = {
    data : string[]
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'head title', MangaLabelExtractor)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.reaperscans.net';

    public constructor() {
        super('reaperscansbr', `Reaper Scans (Portuguese)`, 'https://reaperscans.net', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]>{
        const uri = new URL('/query', this.apiUrl);
        uri.searchParams.set('series_type', 'Comic');
        uri.searchParams.set('page', String(page));
        uri.searchParams.set('perPage', '100');

        const request = new Request(uri.href, {
            method: 'GET',
            headers: {
                'Origin': this.URI.href,
                'Referer': this.URI.href,
            }
        });

        const data = await FetchJSON<JSONMangas>(request);
        return data.data.map(manga => new Manga(this, provider, `/series/${manga.series_slug}`, manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.apiUrl).href);
        const data = await FetchJSON<APISeasons>(request);
        const chapters = [];
        data.seasons.forEach(season => {
            season.chapters.forEach(chapter => {
                chapters.push(new Chapter(this, manga, `${manga.Identifier.replace('/series/', '/chapter/')}/${chapter.chapter_slug}`, chapter.chapter_name));
            });
        });
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.apiUrl).href);
        const { data } = await FetchJSON <APIPages>(request);
        return data.map(page => {
            return new Page(this, chapter, new URL(page));
        });
    }
}