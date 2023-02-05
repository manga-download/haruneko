import { Tags } from '../Tags';
import icon from './EarlyManga.webp';
import { Page, Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest } from '../FetchProvider';

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

@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('earlymanga', `EarlyManga`, 'https://earlym.org', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/earlym\.org\/manga\//.test(url);
    }
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.match(/\/manga\/(\S+)/)[1];
        const apicallurl = new URL('/api/manga/' + mangaid, this.URI);
        const request = new FetchRequest(apicallurl.href);
        const data = await FetchJSON<APISingleManga>(request);
        return new Manga(this, provider, '/manga/' + data.main_manga.slug, data.main_manga.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async _getMangasFromPage(page:number, provider:MangaPlugin) {
        const uri = new URL('/api/search/advanced?page=' + page, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIMangasResult>(request);
        return data.data.map(item => new Manga(this, provider, '/manga/' + item.slug.trim(), item.title.trim()));

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaid = manga.Identifier.match(/\/manga\/(\S+)/)[1];
        const uri = new URL(`/api/manga/${mangaid}/chapterlist`, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIChaptersResult>(request);
        return data.map(item => new Chapter(this, manga, `/manga/${mangaid}/chapter-${item.slug}`, 'Chapter ' + item.chapter_number));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('/api' + chapter.Identifier, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIChapterForPages>(request);
        return data.chapter.images.map(page => new Page(this, chapter, new URL(`/storage/uploads/manga/manga_${data.chapter.manga_id}/chapter_${data.chapter.slug}/${page}`, this.URI)));
    }
}