import { Tags } from '../Tags';
import icon from './ColoredManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, Fetch } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

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
}

type APIChapter = {
    _id: string,
    number: string,
    title: string,
    volume: string
}

type APIVolume = {
    number: string,
    chapters: APIChapter[]
}

type APIPages = {
    paths: {
        path: string
    }[]
}

type DynamicPage = {
    path: string
}

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
        const body = new FormData();
        body.set('index', page.toString());
        const mangas = await FetchJSON<APIMangas>(new Request(new URL('./utils/mangaByIndex', this.apiUrl), {
            method: 'POST',
            body
        }));
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

    public override async FetchPages(chapter: Chapter): Promise<Page<DynamicPage>[]> {
        const { email } = await this.GetCollection<APIManga>({ collection: 'Manga', data: chapter.Parent.Identifier });
        const { paths } = await this.GetCollection<APIPages>({ collection: 'Chapter', data: `${email}/${chapter.Identifier}` });
        return paths.map(image => new Page<DynamicPage>(this, chapter, this.URI, { path: image.path }));
    }

    public override async FetchImage(page: Page<DynamicPage>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return await this.imageTaskPool.Add(async () => {

            const request = this.CreateRequest(new URL('./shared/dynamicImage', this.cdnUrl), {
                path: page.Parameters.path
            });

            const imageAsB64 = await (await Fetch(request)).text();
            const response = await fetch(imageAsB64.replaceAll('"', ''));
            return Common.GetTypedData(await response.arrayBuffer());

        }, priority, signal);
    }

    private async GetCollection<T extends JSONElement>(body: JSONElement): Promise<T> {
        return await FetchJSON<T>(this.CreateRequest(new URL('./core/getData', this.dbUrl), body)) as T;
    }

    private CreateRequest(url: URL, body: JSONElement): Request {
        const formData = new FormData();
        Object.keys(body).forEach(key => formData.set(key, body[key]));
        return new Request(url, {
            method: 'PUT',
            body: formData
        });
    }
}
