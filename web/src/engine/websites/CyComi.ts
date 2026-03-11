import { Tags } from '../Tags';
import icon from './CyComi.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
    resultCode: number;
};

type APIManga = APIResult<{
    titleId: number;
    titleName: string;
}>;

type APIMangas = APIResult<{
    titles: APIManga[ 'data' ][];
}[]>;

type APIVolume = APIResult<{
    chapters: { id: number; }[];
}>;

type APIMedias = {
    data: APIMedia[];
    nextCursor?: number;
    resultCode: number;
};

type APIMedia = {
    dataType: number;
    id: number;
    name: string;
    subName?: string;
    stories?: string;
};

type APIPage = {
    image: string;
    pageNumber: number;
    type: string;
};

type APIPages = APIResult<{
    pages: APIPage[]
}>;

type MediaItem = {
    id: number;
    type: 1 /* Chapter */ | 2 /* Volume */;
};

// TODO: Check for possible revision

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://web.cycomi.com/api/';
    public constructor() {
        super('cycomi', `CyComi`, 'https://cycomi.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').at(-1);
        const { data } = await this.FetchAPI<APIManga>(`./title/detail?titleId=${id}`);
        return new Manga(this, provider, data.titleId.toString(), data.titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const { data, resultCode } = await this.FetchAPI<APIMangas>(`./home/paginatedList?limit=${50}&page=${page}`);
            const mangas = resultCode !== 1 || !data ? [] : data.reduce((accumulator: Manga[], entry) => {
                if (entry) {
                    const titles = entry.titles.map(manga => new Manga(this, provider, manga.titleId.toString(), manga.titleName));
                    accumulator.push(...titles);
                }
                return accumulator;
            }, []);
            mangas.length ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ... await this.FetchMediaItem(manga, 'chapter'),
            ... await this.FetchMediaItem(manga, 'singleBook'),
        ];
    }

    private async FetchMediaItem(manga: Manga, type: string): Promise<Chapter[]> {
        const chapterList = [];
        let cursor: number = undefined;
        do {
            const endpoint = [`./${type}/paginatedList?sort=1&limit=100&titleId=${manga.Identifier}&isWebOnly=0`, cursor ? `&cursor=${cursor}` : ''].join('');
            const { data, resultCode, nextCursor: next } = await this.FetchAPI<APIMedias>(endpoint);
            const chapters = resultCode === 1 && data?.length > 0 ? data.map(chapter => {
                const title = [chapter.name, chapter.subName ?? chapter.stories].filter(item => item).join(' - ');
                return new Chapter(this, manga, JSON.stringify({ id: chapter.id, type: chapter.dataType }), title);
            }) : [];
            chapterList.push(...chapters);
            cursor = next;
        } while (cursor);
        return chapterList;
    }

    public override async FetchPages(container: Chapter): Promise<Page[]> {
        const { type }: MediaItem = JSON.parse(container.Identifier);
        switch (type) {
            case 1: return this.FetchChapterPages(container);
            case 2: return this.FetchVolumePages(container);
            default: return [];
        }
    }

    private async FetchChapterPages(chapter: Chapter): Promise<Page[]> {
        const { id }: MediaItem = JSON.parse(chapter.Identifier);
        const { data: { pages }, resultCode } = await this.FetchAPI<APIPages>(`./chapter/page/list`, {
            titleId: parseInt(chapter.Parent.Identifier),
            chapterId: id
        });
        return resultCode !== 1 ? [] : this.MapPages(chapter, pages);
    }

    private async FetchVolumePages(volume: Chapter): Promise<Page[]> {
        const { id: bookId }: MediaItem = JSON.parse(volume.Identifier);
        const { data: { chapters } } = await this.FetchAPI<APIVolume>(`./singleBook/detail?singleBookId=${bookId}`);
        return !chapters ? [] : chapters.reduce(async (accumulator: Promise<Page[]>, chapter) => {
            const { data: { pages }, resultCode } = await this.FetchAPI<APIPages>(`./singleBook/page/list?singleBookId=${bookId}&chapterId=${chapter.id}`);//await FetchJSON<APIResult<APIPages>>(new Request(url));
            return resultCode !== 1 ? accumulator : (await accumulator).concat(this.MapPages(volume, pages));
        }, Promise.resolve<Page[]>([]));
    }

    private MapPages(container: Chapter, pages: APIPage[]): Page[] {
        return pages.filter(page => page.type === 'image')
            .sort((self, other) => self.pageNumber - other.pageNumber)
            .map(page => new Page(this, container, new URL(page.image), { Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (page.Link.href.includes('/end_page/')) {
            return blob;
        }
        const encrypted = await new Response(blob).arrayBuffer();
        const passphrase = page.Link.pathname.split('/').filter(part => /^[0-9a-zA-Z]{32}$/.test(part)).at(0) as string;
        const decrypted = Decrypt(new Uint8Array(encrypted), passphrase);
        return new Blob([decrypted], { type: blob.type });
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement = undefined): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiURL), {
            method: body ? 'POST' : 'GET',
            body: JSON.stringify(body),
            headers: {
                'Content-type': body ? 'application/json' : undefined
            }
        });
        return FetchJSON<T>(request);
    }
}

function MakeKey(passphrase: string): Uint8Array {
    const key = new Uint8Array(Array(256).keys());
    for (let index = 0, indexSwap = 0; index < key.length; index++) {
        indexSwap = (indexSwap + key[index] + passphrase.charCodeAt(index % passphrase.length)) % 256;
        const temp = key[index];
        key[index] = key[indexSwap];
        key[indexSwap] = temp;
    }
    return key;
}

function Decrypt(encrypted: Uint8Array, passphrase: string): Uint8Array<ArrayBuffer> {
    const key = MakeKey(passphrase);
    const decrypted = new Uint8Array(encrypted.length);
    for (let index = 0, indexKeySwapSource = 0, indexKeySwapTarget = 0; index < encrypted.length; index++) {
        indexKeySwapSource = (indexKeySwapSource + 1) % 256;
        indexKeySwapTarget = (indexKeySwapTarget + key[indexKeySwapSource]) % 256;
        const temp = key[indexKeySwapSource % 256];
        key[indexKeySwapSource % 256] = key[indexKeySwapTarget];
        key[indexKeySwapTarget] = temp;
        const xor = key[(key[indexKeySwapSource] + key[indexKeySwapTarget]) % 256];
        decrypted[index] = encrypted[index] ^ xor;
    }
    return decrypted;
}