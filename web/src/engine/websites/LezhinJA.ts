import { Tags } from '../Tags';
import icon from './LezhinJA.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIResult<T> = {
    status: string,
    message: string,
    results: {
        data: T
    }
}

type APIMangaResults = {
    results: {
        comics: APIComic[]
    }
}

type APIComic = {
    id: string,
    name: string
}

type APIChapter = {
    hash_id: string,
    name: string
}

type APIVolume = {
    hash_id: string,
    name: string
    chapters: APIChapter[]
}

type APIPages = {
    results: APIPage[]
}

type APIPage = {
    image_path: string;
}

type ChapterID = {
    type: string,
    id: string;
}

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://lezhin.jp/api/';
    private readonly xorKey = '57e87c8a4d50b7c3456dbab4ab144b200826e62459039c9915d1e5f5e0bf3a51';

    public constructor() {
        super('lezhin-ja', 'Lezhin (Japanese)', 'https://lezhin.jp', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(new URL(url)), 'title')).at(0).textContent.split('｜').at(0).trim();
        return new Manga(this, provider, url.split('/').at(-1), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            return this.FetchAPI<APIMangaResults>(`./search/quick?keyword=${character}`);
        });

        const results: Manga[] = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.results.comics.map(manga => new Manga(this, provider, manga.id, manga.name));
            accumulator.push(...mangas);
            return accumulator;
        }, []);

        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ...await this.GetEntries(manga, 'all-chapters'),
            ...await this.GetEntries(manga, 'volumes')
        ];
    }

    private async GetEntries(manga: Manga, type: string): Promise<Chapter[]> {
        const { results: { data } } = await this.FetchAPI< APIResult<APIVolume[]>>(`./comic/${manga.Identifier}/${type}?page_size=9999&page=1`);
        switch (type) {
            case 'all-chapters': {
                return data.reduce((accumulator: Chapter[], volume) => {
                    const chapters = volume.chapters.map(chapter => new Chapter(this, manga, JSON.stringify({ id: chapter.hash_id, type: 'chapter' }), chapter.name.replace(manga.Title, '').trim() ?? chapter.name));
                    return accumulator.concat(chapters);
                }, []);
            };
            case 'volumes': {
                return data.map(volume => new Chapter(this, manga, JSON.stringify({ id: volume.hash_id, type: 'volume' }), volume.name.replace(manga.Title, '').trim() ?? volume.name));
            }
        }
        return [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id, type }: ChapterID = JSON.parse(chapter.Identifier);
        try {
            const { results } = await this.FetchAPI<APIPages>(`./comic/${chapter.Parent.Identifier}/${type}/${id}/viewer`);
            return results.map(page => new Page(this, chapter, new URL(page.image_path)));
        } catch { //in case of chapter unavailable error 400 is thrown :/
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
    }

    public override async FetchImage(page: Page<APIPage>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return this.DecryptImage(blob);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiUrl));
        return FetchJSON<T>(request);
    }

    private async DecryptImage(blob: Blob): Promise<Blob> {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const xorkey = new Uint8Array(this.xorKey.match(/.{1,2}/g).map(e => parseInt(e, 16)));
        for (let n = 0; n < bytes.length; n++)
            bytes[n] = bytes[n] ^ xorkey[n % xorkey.length];
        return Common.GetTypedData(bytes.buffer);
    }
}