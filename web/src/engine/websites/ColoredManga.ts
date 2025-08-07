import { Tags } from '../Tags';
import icon from './ColoredManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    id: string,
    name: string
}[];

type APIManga = {
    _id: string,
    name: string,
    chapters: APIChapter[],
    volumes: APIVolume[]
    email: string
};

type APIChapter = {
    _id: string,
    number: string,
    title: string,
};

type APIVolume = {
    number: string,
    chapters: APIChapter[]
};

type APIPages = {
    paths: {
        path: string
    }[]
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = `${this.URI.origin}/api/`;
    private readonly dbUrl = `${this.URI.origin.replace('https://', 'https://db.')}/api/`;
    private readonly cdnUrl = `${this.URI.origin.replace('https://', 'https://cdn.')}/api/`;

    public constructor() {
        super('coloredmanga', 'Colored Manga', 'https://coloredmanga.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaSlug = url.split('/').at(-1);
        const { name } = await this.GetCollection<APIManga>({ collection: 'Manga', data: mangaSlug });
        return new Manga(this, provider, mangaSlug, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin) {
        const mangas = await this.FetchAPI<APIMangas>('./utils/mangaByIndex', this.apiUrl, { index: page.toString() }, 'POST');
        return mangas.map(manga => new Manga(this, provider, manga.id, manga.name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaData = await this.GetCollection<APIManga>({ collection: 'Manga', data: manga.Identifier });
        return this.ExtractChaptersData(mangaData).map(chapter => {
            const title = [
                chapter.number,
                chapter.title ? '-' : '',
                chapter.title,
            ].join(' ').trim();
            return new Chapter(this, manga, chapter._id, title);
        });
    }

    private ExtractChaptersData(mangaData: APIManga): APIChapter[] {
        return mangaData.chapters.length > 0 ? mangaData.chapters : mangaData.volumes.reduce((chaptersAccumulator: APIChapter[], currentVolume) => {
            chaptersAccumulator.push(...currentVolume.chapters);
            return chaptersAccumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { email } = await this.GetCollection<APIManga>({ collection: 'Manga', data: chapter.Parent.Identifier });
        const { paths } = await this.GetCollection<APIPages>({ collection: 'Chapter', data: `${email}/${chapter.Identifier}` });
        return paths.map(image => new Page(this, chapter, new URL(`./shared/dynamicImage?path=${image.path}`, this.cdnUrl)));
    }

    private async GetCollection<T extends JSONElement>(body: JSONElement): Promise<T> {
        return this.FetchAPI<T>('./core/getData', this.dbUrl, body);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, baseUrl: string, body: JSONElement, method: string = 'PUT'): Promise<T> {
        const formData = new FormData();
        Object.keys(body).forEach(key => formData.set(key, body[key]));
        return FetchJSON<T>(new Request(new URL(endpoint, baseUrl), {
            method,
            body: formData
        }));
    }
}
