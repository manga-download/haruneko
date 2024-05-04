import { Tags } from '../Tags';
import icon from './CyComi.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: null | T,
    resultCode: number
};

type APIManga = {
    titleId: number,
    titleName: string,
}

type APIMangas = {
    data: APIMangasOrNull[],
    resultCode: number
}

type APIMangasOrNull = null | APIMangasEntry

type APIMangasEntry = {
    titles: APIManga[]
}

type APIVolumes = {
    singleBooks?: APIVolume[]
}

type APIVolume = {
    id: number,
    name: string,
    stories: string,
    chapters?: APIChapter[]
};

type APIChapters = {
    data: APIChapter[],
    nextCursor?: number,
    resultCode: number,
};

type APIChapter = {
    id: number,
    name: string,
    subName: string,
}

type APIPage = {
    image: string,
    pageNumber: number,
    type: string,
};

type APIPages = {
    pages: APIPage[]
}

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://web.cycomi.com/api';
    public constructor() {
        super('cycomi', `CyComi`, 'https://cycomi.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').pop();
        const request = new Request(`${this.apiURL}/title/detail?titleId=${id}`);
        const { data } = await FetchJSON<APIResult<APIManga>>(request);
        return new Manga(this, provider, data.titleId.toString(), data.titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const request = new Request(`${this.apiURL}/home/paginatedList?limit=${50}&page=${page}`);
            const { data, resultCode } = await FetchJSON<APIMangas>(request);
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

    private async FetchMangaVolumes(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.apiURL}/singleBook/list?titleId=${manga.Identifier}`);
        const { data, resultCode } = await FetchJSON<APIResult<APIVolumes>>(request);
        return resultCode !== 1 || !data.singleBooks ? [] : data.singleBooks.map(volume => {
            const title = [volume.name, volume.stories].filter(item => item).join(' - ');
            return new Chapter(this, manga, '/singleBook/detail?singleBookId=' + volume.id, title);
        }) ?? [];
    }

    private async FetchMangaChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`${this.apiURL}/chapter/paginatedList?sort=1&limit=100&titleId=${manga.Identifier}`);
        const chapterList = [];
        let cursor: number = null;
        do {
            cursor ? uri.searchParams.set('cursor', `${cursor}`) : uri.searchParams.delete('cursor');
            const { data, resultCode, nextCursor: next } = await FetchJSON<APIChapters>(new Request(uri));
            const chapters = resultCode === 1 && data?.length > 0 ? data.map(chapter => {
                const title = [chapter.name, chapter.subName].filter(item => item).join(' - ');
                return new Chapter(this, manga, `/chapter/page/list?titleId=${manga.Identifier}&chapterId=${chapter.id}`, title);
            }) : [];
            chapterList.push(...chapters);
            cursor = next;
        } while (cursor);
        return chapterList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ... await this.FetchMangaVolumes(manga),
            ... await this.FetchMangaChapters(manga),
        ];
    }

    private MapPages(container: Chapter, pages: APIPage[]): Page[] {
        return pages.filter(page => page.type === 'image')
            .sort((self, other) => self.pageNumber - other.pageNumber)
            .map(page => new Page(this, container, new URL(page.image), { Referer: this.URI.href }));
    }

    private async FetchVolumePages(volume: Chapter): Promise<Page[]> {
        const request = new Request(this.apiURL + volume.Identifier);
        const { data: { id, chapters } } = await FetchJSON<APIResult<APIVolume>>(request);
        return !chapters ? [] : chapters.reduce(async (accumulator: Promise<Page[]>, chapter) => {
            const url = `${this.apiURL}/singleBook/page/list?singleBookId=${id}&chapterId=${chapter.id}`;
            const { data: { pages }, resultCode } = await FetchJSON<APIResult<APIPages>>(new Request(url));
            return resultCode !== 1 ? accumulator : (await accumulator).concat(this.MapPages(volume, pages));
        }, Promise.resolve<Page[]>([]));
    }

    private async FetchChapterPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(this.apiURL + chapter.Identifier);
        const request = new Request(uri.origin + uri.pathname, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titleId: parseInt(uri.searchParams.get('titleId') ?? ''),
                chapterId: parseInt(uri.searchParams.get('chapterId') ?? '')
            })
        });
        const { data: { pages }, resultCode } = await FetchJSON<APIResult<APIPages>>(request);
        return resultCode !== 1 ? [] : this.MapPages(chapter, pages);
    }

    public override async FetchPages(container: Chapter): Promise<Page[]> {
        if (container.Identifier.startsWith('/singleBook/')) {
            return this.FetchVolumePages(container);
        }
        if (container.Identifier.startsWith('/chapter/')) {
            return this.FetchChapterPages(container);
        }
        return [];
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (page.Link.href.includes('/end_page/')) return data; //https://cycomi.com/title/191 got unencrypted end page
        const encrypted = await new Response(data).arrayBuffer();
        const passphrase = page.Link.pathname.split('/').filter(part => /^[0-9a-zA-Z]{32}$/.test(part)).shift() as string;
        const decrypted = Decrypt(new Uint8Array(encrypted), passphrase);
        return new Blob([decrypted], { type: data.type });
    }
}

function MakeKey(passphrase: string) {
    const key = new Uint8Array(Array(256).keys());
    for (let index = 0, indexSwap = 0; index < key.length; index++) {
        indexSwap = (indexSwap + key[index] + passphrase.charCodeAt(index % passphrase.length)) % 256;
        const temp = key[index];
        key[index] = key[indexSwap];
        key[indexSwap] = temp;
    }
    return key;
}

function Decrypt(encrypted: Uint8Array, passphrase: string) {
    const key = MakeKey(passphrase);
    const decrypted = new Uint8Array(encrypted.length);
    for (let index = 0, indexKeySwapSource = 0, indexKeySwapTarget = 0; index < encrypted.length; index++) {
        indexKeySwapSource = (indexKeySwapSource + 1) % 256;
        indexKeySwapTarget = (indexKeySwapTarget + key[indexKeySwapSource]) % 256;
        const temp = key[indexKeySwapSource % 256];
        key[indexKeySwapSource % 256] = key[indexKeySwapTarget],
        key[indexKeySwapTarget] = temp;
        const xor = key[(key[indexKeySwapSource] + key[indexKeySwapTarget]) % 256];
        decrypted[index] = encrypted[index] ^ xor;
    }
    return decrypted;
}