import { Tags } from '../Tags';
import icon from './LezhinJA.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { GetBytesFromHex } from '../BufferEncoder';

type APIVolumes = {
    results: {
        data: APIVolume[];
    }
};

type APIMangas = {
    results: {
        comics: APIComic[];
    }
};

type APIPages = {
    results: APIPage[]
};

type APIComic = {
    id: string;
    name: string;
};

type APIChapter = {
    hash_id: string;
    name: string;
};

type APIVolume = {
    hash_id: string;
    name: string;
    chapters: APIChapter[];
};

type APIPage = {
    image_path: string;
};

type ChapterID = {
    type: string;
    id: string;
};

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'title', (element: HTMLTitleElement, uri) => ({ id: uri.pathname, title: element.textContent.split('｜').at(0).trim() }))
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://lezhin.jp/api/';
    private readonly xorKey = '57e87c8a4d50b7c3456dbab4ab144b200826e62459039c9915d1e5f5e0bf3a51';

    public constructor() {
        super('lezhin-ja', 'Lezhin (Japanese)', 'https://lezhin.jp', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('ADULT_ENABLE', 'true')`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            return this.FetchAPI<APIMangas>(`./search/quick?keyword=${character}`);
        });
        const results: Manga[] = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.results.comics.map(({ id, name }) => new Manga(this, provider, `/comic/${id}`, name));
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
        const { results: { data } } = await this.FetchAPI<APIVolumes>(`.${manga.Identifier}/${type}?page_size=9999&page=1`);
        switch (type) {
            case 'all-chapters': {
                return data.reduce((accumulator: Chapter[], volume) => {
                    const chapters = volume.chapters.map(({ hash_id: id, name }) => new Chapter(this, manga, JSON.stringify({ id, type: 'chapter' }), name.replace(manga.Title, '').trim() || name));
                    return accumulator.concat(chapters);
                }, []);
            }
            case 'volumes': {
                return data.map(({ hash_id: id, name }) => new Chapter(this, manga, JSON.stringify({ id, type: 'volume' }), name.replace(manga.Title, '').trim() || name));
            }
        }
        return [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id, type }: ChapterID = JSON.parse(chapter.Identifier);
        try {
            const { results } = await this.FetchAPI<APIPages>(`.${chapter.Parent.Identifier}/${type}/${id}/viewer`);
            return results.map(({ image_path: path }) => new Page(this, chapter, new URL(path)));
        } catch { //in case of chapter unavailable error 400 is thrown :/
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
    }

    public override async FetchImage(page: Page<APIPage>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return this.DecryptImage(blob);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl)));
    }

    private async DecryptImage(blob: Blob): Promise<Blob> {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const xorkey = GetBytesFromHex(this.xorKey);
        for (let n = 0; n < bytes.length; n++)
            bytes[n] = bytes[n] ^ xorkey[n % xorkey.length];
        return Common.GetTypedData(bytes.buffer);
    }
}