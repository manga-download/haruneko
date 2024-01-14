import { Tags } from '../Tags';
import icon from './EarlyManga.webp';
import { Page, Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangasResult = {
    data : APIManga[]
}

type APIManga = {
    id: number
    title: string
    slug : string
}

type APIChaptersResult = APIChapter[];

type APIChapter = {
    id: number
    slug: string
    title: string
    chapter_number : string
}

type APISingleManga = {
    main_manga: {id : number, title : string, slug : string}
}

type APIChapterForPages = {
    chapter : {
        images: string[]
        manga_id: number
        slug : string
     }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('earlymanga', `EarlyManga`, 'https://earlym.org', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/\\d+/\\S+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.match(/\/manga\/(\S+)/)[1];
        const apicallurl = new URL('/api/manga/' + mangaid, this.URI);
        const request = new Request(apicallurl.href);
        const data = await FetchJSON<APISingleManga>(request);
        const id = { id: data.main_manga.id, slug: data.main_manga.slug };
        return new Manga(this, provider, JSON.stringify(id), data.main_manga.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async _getMangasFromPage(page: number, provider: MangaPlugin) {
        const uri = new URL('/api/search/advanced/post?page=' + page, this.URI);
        const body = {
            'list_order': 'desc'
        };
        const request = new Request(uri.href, {
            method: 'POST', body: JSON.stringify(body), headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            }
        });
        const data = await FetchJSON<APIMangasResult>(request);
        return data.data.map(item => {
            const id = { id: item.id, slug: item.slug };
            return new Manga(this, provider, JSON.stringify(id), item.title.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaid: APIManga = JSON.parse(manga.Identifier);
        const uri = new URL(`/api/manga/${mangaid.id}/${mangaid.slug}/chapterlist`, this.URI);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIChaptersResult>(request);
        return data.map(item => {
            const id = { id: item.id, slug: item.slug };
            return new Chapter(this, manga, JSON.stringify(id), 'Chapter ' + item.chapter_number);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaid: APIManga = JSON.parse(chapter.Parent.Identifier);
        const chapterid: APIChapter = JSON.parse(chapter.Identifier);
        const uri = new URL(`/api/manga/${mangaid.id}/${mangaid.slug}/${chapterid.id}/chapter-${chapterid.slug}`, this.URI);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIChapterForPages>(request);
        return data.chapter.images.map(page => new Page(this, chapter, new URL(`/storage/uploads/manga/manga_${data.chapter.manga_id}/chapter_${data.chapter.slug}/${page}`, this.URI)));
    }
}