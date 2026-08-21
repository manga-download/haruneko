import { Tags } from '../Tags';
import icon from './MangaUpGlobal.webp';
import protoTypes from './MangaUpGlobal.proto?raw';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchProto } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DecryptAES } from '../Crypto';

type APIMangaDetailView = {
    titleName: string;
    chapters: APIChapter[];
};

type APISearch = {
    titles: APIManga[];
};

type APIManga = {
    titleId: number;
    titleName: string;
};

type APIChapter = {
    id: number;
    titleName: string;
    subName: string;
};

type APIPages = {
    pageblocks: {
        pages: {
            imageUrl: string;
            encryptionKey: string;
            iv: string | undefined;
        }[];
    }[];
};

type PageParameters = {
    keyData?: string;
    iv?: string;
};

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://global-api.manga-up.com/api/';
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
        const { titleName } = await FetchProto<APIMangaDetailView>(new Request(new URL(`./manga/detail_v2?title_id=${mangaid}`, this.apiURL)), protoTypes, 'MangaUpGlobal.MangaDetailView');
        return new Manga(this, provider, mangaid, titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { titles } = await FetchProto<APISearch>(new Request(new URL(`./search`, this.apiURL)), protoTypes, 'MangaUpGlobal.SearchView');
        return titles.map(({ titleId, titleName }) => new Manga(this, provider, `${titleId}`, titleName.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchProto<APIMangaDetailView>(new Request(new URL(`./manga/detail_v2?title_id=${manga.Identifier}`, this.apiURL)), protoTypes, 'MangaUpGlobal.MangaDetailView');
        return chapters.map(({ id, titleName, subName }) => new Chapter(this, manga, `${id}`, [titleName, subName].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { pageblocks } = await FetchProto<APIPages>(new Request(new URL(`./manga/viewer_v2?chapter_id=${chapter.Identifier}&quality=high`, this.apiURL), { method: 'POST' }), protoTypes, 'MangaUpGlobal.MangaViewerV2View');
        return pageblocks.shift().pages.map(({ imageUrl, encryptionKey, iv }) => new Page<PageParameters>(this, chapter, new URL(imageUrl, this.imagesCDN), {
            keyData: encryptionKey,
            iv
        }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const bytes = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { signal }));
            return response.arrayBuffer();
        }, priority, signal);
        const { keyData, iv } = page.Parameters;
        return Common.GetTypedData(keyData && iv ? await this.Decrypt(bytes, keyData, iv) : bytes);
    }

    private async Decrypt(encrypted: ArrayBuffer, keyData: string, iv: string): Promise<ArrayBuffer> {
        return DecryptAES(encrypted, GetBytesFromHex(keyData), { name: 'AES-CBC', iv: GetBytesFromHex(iv) });
    }
}