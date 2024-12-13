import { Tags } from '../Tags';
import icon from './CoroCoro.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchProto } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromHex } from '../BufferEncoder';
import prototypes from './CoroCoro.proto?raw';

type TitleListView = {
    titles: {
        titles: APITitle[]
    }
}

type TitleDetailView = {
    title: APITitle,
    chapters: APIChapter[]
}

type APITitle = {
    id: number,
    name: string
}

type APIChapter = {
    id: number,
    mainName: string,
    subName: string
}

type ViewerView = {
    pages?: APIImage[],
    aesKey: string,
    aesIv: string
}

type APIImage = {
    src: string
}

type CryptoParams = null | {
    iv: string,
    key: string,
}

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://www.corocoro.jp/api/csr';

    public constructor() {
        super('corocoro', `CoroCoro Online (コロコロオンライン)`, 'https://www.corocoro.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/[\\d]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.split('/').at(-1);
        const requestUrl = new URL(this.apiUrl);
        requestUrl.searchParams.set('rq', 'title/detail');
        requestUrl.searchParams.set('title_id', mangaId);
        const { title: { id, name } } = await FetchProto<TitleDetailView>(new Request(requestUrl), prototypes, 'TitleDetailView');
        return new Manga(this, provider, id.toString(), name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
            const url = new URL(this.apiUrl);
            url.searchParams.set('rq', 'title/list/update_day');
            url.searchParams.set('day', day);
            const { titles: { titles } } = await FetchProto<TitleListView>(new Request(url), prototypes, 'TitleListView');
            const manga = titles.map(manga => new Manga(this, provider, manga.id.toString(), manga.name));
            mangaList.push(...manga);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(this.apiUrl);
        url.searchParams.set('rq', 'title/detail');
        url.searchParams.set('title_id', manga.Identifier);
        const { chapters } = await FetchProto<TitleDetailView>(new Request(url), prototypes, 'TitleDetailView');
        return chapters.map(chapter => new Chapter(this, manga, chapter.id.toString(), [chapter.mainName, chapter.subName].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<CryptoParams>[]> {
        const url = new URL(this.apiUrl);
        url.searchParams.set('rq', 'chapter/viewer');
        url.searchParams.set('chapter_id', chapter.Identifier);
        const { pages, aesIv, aesKey } = await FetchProto<ViewerView>(new Request(url, { method: 'PUT' }), prototypes, 'ViewerView');
        const params: CryptoParams = aesIv ? {
            key: aesKey,
            iv: aesIv
        } : null;
        return pages ? pages.map(page => new Page(this, chapter, new URL(page.src), params)): [];
    }

    public override async FetchImage(page: Page<CryptoParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const cryptoParams = page.Parameters;
        if (cryptoParams?.iv) {
            const encrypted = await blob.arrayBuffer();
            const cipher = { name: 'AES-CBC', iv: GetBytesFromHex(cryptoParams.iv) };
            const cryptoKey = await crypto.subtle.importKey('raw', GetBytesFromHex(cryptoParams.key), cipher, false, ['decrypt']);
            const decrypted = await crypto.subtle.decrypt(cipher, cryptoKey, encrypted);
            return Common.GetTypedData(decrypted);
        } else return blob;
    }
}