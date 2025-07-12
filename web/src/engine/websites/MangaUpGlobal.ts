import { Tags } from '../Tags';
import icon from './MangaUpGlobal.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchProto } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as W } from '../../i18n/ILocale';
import protoTypes from './MangaUpGlobal.proto?raw';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromHex } from '../BufferEncoder';

type APIMangaDetailView = {
    titleName: string,
    chapters: APIChapter[]
}

type APISearch = {
    titles: APIManga[]
}

type APIManga = {
    titleId: number,
    titleName: string
}

type APIChapter = {
    id: number,
    titleName: string,
    subName: string;
}

type APIPages = {
    pageblocks: {
        pages: {
            imageUrl: string,
            encryptionKey: string,
            iv: string | undefined
        }[]
    }[]
}

type PageParameters = null | {
    keyData: string,
    iv: string
}

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://global-api.manga-up.com/api/';
    private readonly imagesCDN = 'https://global-img.manga-up.com/';

    public constructor() {
        super('mangaupglobal', `MangaUp (Global)`, `https://global.manga-up.com`, Tags.Language.English, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[\\d]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.split('/').at(-1);
        const request = new Request(new URL(`./manga/detail_v2?title_id=${mangaid}`, this.apiUrl));
        const { titleName } = await FetchProto<APIMangaDetailView>(request, protoTypes, 'MangaUpGlobal.MangaDetailView');
        return new Manga(this, provider, mangaid, titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`./search`, this.apiUrl));
        const { titles } = await FetchProto<APISearch>(request, protoTypes, 'MangaUpGlobal.SearchView');
        return titles.map(manga => new Manga(this, provider, manga.titleId.toString(), manga.titleName.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`./manga/detail_v2?title_id=${manga.Identifier}`, this.apiUrl));
        const { chapters } = await FetchProto<APIMangaDetailView>(request, protoTypes, 'MangaUpGlobal.MangaDetailView');
        return chapters.map(chapter => new Chapter(this, manga, chapter.id.toString(), [chapter.titleName, chapter.subName].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const request = new Request(new URL(`./manga/viewer_v2?chapter_id=${chapter.Identifier}&quality=high`, this.apiUrl), { method: 'POST' });
        const data = await FetchProto<APIPages>(request, protoTypes, 'MangaUpGlobal.MangaViewerV2View');

        if (!data.pageblocks) throw new Exception(W.Plugin_Common_Chapter_UnavailableError);

        return data.pageblocks.shift().pages.map(page => {
            const params: PageParameters = page.iv ? {
                keyData: page.encryptionKey,
                iv: page.iv
            } : null;
            return new Page<PageParameters>(this, chapter, new URL(page.imageUrl, this.imagesCDN), params);
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const { keyData, iv } = page.Parameters ?? {};
        if (keyData && iv) {
            const encrypted = await blob.arrayBuffer();
            const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
            const cryptoKey = await crypto.subtle.importKey('raw', GetBytesFromHex(keyData), algorithm, false, [ 'decrypt' ]);
            const decrypted = await crypto.subtle.decrypt(algorithm, cryptoKey, encrypted);
            return Common.GetTypedData(decrypted);
        } else return blob;
    }
}