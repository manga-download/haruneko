import { Tags } from '../Tags';
import icon from './ComicFuz.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './ComicFuz.proto?raw';
import { FetchProto } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import protobuf from 'protobufjs';

type MangaDetailResponse = {
    manga: ApiManga,
    chapters: ChapterGroup[]
}

type ApiManga = {
    id: number,
    title: string
}

type ChapterGroup = {
    chapters: ApiChapter[]
}

type ApiChapter = {
    id: number,
    title: string
}

type MangaViewerResponse = {
    pages: ViewerPage[];

}

type ViewerPage = {
    image: ApiImage
}

type ApiImage = {
    imageUrl: string,
    urlScheme: string,
    iv: string,
    encryptionKey: string,
    imageWidth: number,
    imageHeight: number,
    isExtraPage: boolean
}

type MangasByDayOfWeekResponse = {
    mangas: ApiManga[]
}

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.comic-fuz.com';
    private readonly imgUrl = 'https://img.comic-fuz.com';

    public constructor() {
        super('comicfuz', 'COMIC FUZ', 'https://comic-fuz.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/\\d+$`).test(url);

    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').pop();
        const data = await this.fetchMangaDetail(id);
        return new Manga(this, provider, id, data.manga.title);
    }

    private async fetchMangaDetail(titleId: string): Promise<MangaDetailResponse> {
        const uri = new URL('v1/manga_detail', this.apiUrl);
        const payload = {
            deviceInfo: {
                deviceType: 2,
            },
            mangaId: titleId
        };
        const request = await this.createPROTORequest(uri, 'ComicFuz.MangaDetailRequest', payload);
        return FetchProto<MangaDetailResponse>(request, protoTypes, 'ComicFuz.MangaDetailResponse');
    }

    private async createPROTORequest(uri: URL, messageProtoType: string, payload: unknown): Promise<Request> {
        const root = await protobuf.parse(protoTypes, { keepCase: true }).root;
        const messageType = root.lookupType(messageProtoType);
        const message = messageType.encode(payload);
        return new Request(uri.href, {
            body: message.finish(),
            method: 'POST'
        });
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('v1/mangas_by_day_of_week', this.apiUrl);
        const payload = {
            deviceInfo: {
                deviceType: 2
            },
            dayOfWeek: 0
        };
        const request = await this.createPROTORequest(uri, 'ComicFuz.MangasByDayOfWeekRequest', payload);
        const data = await FetchProto<MangasByDayOfWeekResponse>(request, protoTypes, 'ComicFuz.MangasByDayOfWeekResponse');
        return data.mangas.map(manga => new Manga(this, provider, manga.id.toString(), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await this.fetchMangaDetail(manga.Identifier);
        return data.chapters.map(group => group.chapters.map(chapt => new Chapter(this, manga, chapt.id.toString(), chapt.title))).flat();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('v1/manga_viewer', this.apiUrl);
        const payload = {
            deviceInfo: {
                deviceType: 2
            },
            chapterId: chapter.Identifier,
            useTicket: false,
            consumePoint: {
                event: 0,
                paid: 0
            }
        };
        const request = await this.createPROTORequest(uri, 'ComicFuz.MangaViewerRequest', payload);
        let data: MangaViewerResponse = undefined;
        try {
            data = await FetchProto<MangaViewerResponse>(request, protoTypes, 'ComicFuz.MangaViewerResponse');
        } catch (error) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return data.pages
            .filter(page => page.image?.imageUrl && page.image.isExtraPage != true)
            .map(page => new Page(this, chapter, new URL(page.image.imageUrl, this.imgUrl), { ...page.image }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const payload = page.Parameters as ApiImage;
        if (!payload.encryptionKey) return data;
        const encrypted = await data.arrayBuffer();
        const decrypted = await this.decryptPicture(new Uint8Array(encrypted), payload);
        return Common.GetTypedData(decrypted);
    }

    async decryptPicture(encrypted: Uint8Array, page: ApiImage): Promise<ArrayBuffer> {
        const iv = Buffer.from(page.iv, 'hex');
        const key = Buffer.from(page.encryptionKey, 'hex');

        const secretKey = await crypto.subtle.importKey(
            'raw',
            key,
            {
                name: 'AES-CBC',
                length: 128
            }, true, ['encrypt', 'decrypt']);

        return crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: iv
        }, secretKey, encrypted);
    }
}
