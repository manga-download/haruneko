import { Tags } from '../Tags';
import icon from './ComicFuz.webp';
import protoTypes from './ComicFuz.proto?raw';
import protobuf from 'protobufjs';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/TaskPool';
import { FetchProto } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    manga: {
        id: number;
        title: string;
    };
};

type APIMangas = {
    mangas: APIManga[ 'manga' ][];
}

type APIChapters = {
    chapters: {
        chapters: {
            id: number;
            title: string;
        }[];
    }[];
}

type APIPages = {
    pages: {
        image: {
            imageUrl: string;
            iv: string;
            encryptionKey: string;
            isExtraPage: boolean;
        };
    }[];
};

type PageParameters = {
    keyData?: string;
    iv?: string;
};

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.comic-fuz.com/v1/';
    private readonly imgURL = 'https://img.comic-fuz.com';

    public constructor() {
        super('comicfuz', 'COMIC FUZ', 'https://comic-fuz.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    private async FetchProtoAPI<T extends JSONElement>(endpoint: string, payload: JSONObject, requestProtoTypeName: string, responseProtoTypeName: string) {
        Object.assign(payload, { deviceInfo: { deviceType: 2 } });
        const root = protobuf.parse(protoTypes, { keepCase: true }).root;
        const request = new Request(new URL(endpoint, this.apiURL), {
            body: new Uint8Array(root.lookupType(requestProtoTypeName).encode(payload).finish()),
            method: 'POST',
        });
        return FetchProto<T>(request, protoTypes, responseProtoTypeName);
    }

    private async FetchMangaDetail<T extends APIManga | APIChapters>(mangaId: string): Promise<T> {
        return this.FetchProtoAPI<T>('./manga_detail', { mangaId }, 'ComicFuz.MangaDetailRequest', 'ComicFuz.MangaDetailResponse');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/\\d+$`).test(url);

    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga: { id, title } } = await this.FetchMangaDetail<APIManga>(new URL(url).pathname.split('/').at(-1));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { mangas } = await this.FetchProtoAPI<APIMangas>('./mangas_by_day_of_week', { dayOfWeek: 0 }, 'ComicFuz.MangasByDayOfWeekRequest', 'ComicFuz.MangasByDayOfWeekResponse');
        return mangas.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchMangaDetail<APIChapters>(manga.Identifier);
        return chapters.map(({ chapters }) => chapters.map(({ id, title }) => new Chapter(this, manga, `${id}`, title))).flat();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchProtoAPI<APIPages>('./manga_viewer', {
            chapterId: chapter.Identifier,
            useTicket: false,
            consumePoint: { event: 0, paid: 0 }
        }, 'ComicFuz.MangaViewerRequest', 'ComicFuz.MangaViewerResponse');
        return pages
            .filter(page => page.image?.imageUrl && page.image.isExtraPage != true)
            .map(({ image: { imageUrl, encryptionKey, iv } }) => new Page<PageParameters>(this, chapter, new URL(imageUrl, this.imgURL), { keyData: encryptionKey, iv }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const { keyData, iv } = page.Parameters;
        return keyData && iv ? this.DecryptPicture(data, page.Parameters) : data;
    }

    private async DecryptPicture(encrypted: Blob, page: PageParameters): Promise<Blob> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(page.iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromHex(page.keyData), algorithm, false, [ 'decrypt' ]);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, await encrypted.arrayBuffer());
        return Common.GetTypedData(decrypted);
    }
}