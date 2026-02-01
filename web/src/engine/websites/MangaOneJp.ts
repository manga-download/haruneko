import { Tags } from '../Tags';
import icon from './MangaOneJp.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './MangaOneJp.proto?raw';
import { FetchProto } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromHex } from '../BufferEncoder';

type WebRensaiListResponse = {
    dayOfWeekTitleLists: {
        titles: APITitle[]
    }[]
};

type APITitle = {
    title: {
        titleId: number;
        titleName: string;
    }
};

type WebChapterListForViewerResponse = {
    chapterList: WebChapterListUsedByPaging;
    volumeList: WebVolumeListUsedByPaging;
};

type WebChapterListUsedByPaging = {
    chapterList: ChapterProto[];
};

type WebVolumeListUsedByPaging = {
    volumeList: Volume[];
};

type ChapterProto = {
    chapterId: number;
    chapterName: string;
    description: string;
};

type Volume = {
    volume: {
        id: number;
        name: string;
    }
};

type ItemID = {
    id: number;
    type: 'chapter' | 'volume';
};

type WebViewerResponse = {
    aesIv: string;
    aesKey: string;
    currentTitle: APITitle;
    pages: PageProto[];
};

type PageProto = {
    image?: {
        imageUrl: string
    }
};

type PageParameters = {
    key: string;
    iv: string;
};

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://manga-one.com/api/client';

    public constructor() {
        super('mangaonejp', 'Manga One (Japan)', 'https://manga-one.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/\\d+/(chapter|volume)/\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [, mangaId, type, itemId] = url.match(/\/manga\/(\d+)\/(chapter|volume)\/(\d+)/);
        const { currentTitle: { title: { titleName } } } = await this.GetWebViewerResponse(mangaId, itemId, type);
        return new Manga(this, provider, mangaId, titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { dayOfWeekTitleLists } = await FetchProto<WebRensaiListResponse>(new Request(new URL('?rq=rensai', this.apiUrl)), protoTypes, 'MangaOneJp.WebRensaiListResponse');
        return dayOfWeekTitleLists.reduce((accumulator: Manga[], day) => {
            accumulator.push(...day.titles.map(({ title: { titleId, titleName } }) => new Manga(this, provider, `${titleId}`, titleName)));
            return accumulator;
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ...await this.FetchMediaItem(manga, 'chapter'),
            ...await this.FetchMediaItem(manga, 'volume'),
        ];
    }

    private async FetchMediaItem(manga: Manga, mediatype: 'chapter' | 'volume'): Promise<Chapter[]> {
        const url = new URL(`?rq=viewer/chapter_list&title_id=${manga.Identifier}&page=1&limit=9999&sort_type=desc&type=${mediatype}`, this.apiUrl);
        switch (mediatype) {
            case 'chapter': {
                const { chapterList: { chapterList } } = await FetchProto<WebChapterListForViewerResponse>(new Request(url), protoTypes, 'MangaOneJp.WebChapterListForViewerResponse');
                return chapterList.map(({ chapterId, chapterName, description }) => {
                    const title = [chapterName, description].join(' ').trim();
                    return new Chapter(this, manga, JSON.stringify({ id: chapterId, type: 'chapter' }), title);
                });
            }
            case 'volume': {
                const { volumeList: { volumeList } } = await FetchProto<WebChapterListForViewerResponse>(new Request(url), protoTypes, 'MangaOneJp.WebChapterListForViewerResponse');
                return volumeList.map(({ volume: { id, name } }) => new Chapter(this, manga, JSON.stringify({ id, type: 'volume' }), name));
            }
            default: return [];
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { id, type }: ItemID = JSON.parse(chapter.Identifier);

        let data = await this.GetWebViewerResponse(chapter.Parent.Identifier, `${id}`, type);
        if (!data.pages) {
            data = await this.GetWebViewerResponse(chapter.Parent.Identifier, `${id}`, type, true);
            if (!data.pages)
                throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return data.pages.filter(page => page.image)
            .map(({ image: { imageUrl } }) => new Page<PageParameters>(this, chapter, new URL(imageUrl), { key: data.aesKey, iv: data.aesIv }));
    }

    private async GetWebViewerResponse(mangaId: string, itemId: string, type: string, isTrial: boolean = false): Promise<WebViewerResponse> {
        const url = new URL(`?rq=viewer_v2&title_id=${mangaId}&viewer_type=${type}&is_trial=${isTrial}`, this.apiUrl);
        url.searchParams.set(type === 'volume' ? 'volume_id_for_read' : 'chapter_id', itemId);
        return await FetchProto<WebViewerResponse>(new Request(url, { method: 'POST' }), protoTypes, 'MangaOneJp.WebViewerResponse');
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const { key, iv } = page.Parameters;
        return key && iv ? this.DecryptPicture(blob, key, iv) : blob;
    }

    private async DecryptPicture(encrypted: Blob, key: string, iv: string): Promise<Blob> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const secretKey = await crypto.subtle.importKey('raw', GetBytesFromHex(key), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, secretKey, await encrypted.arrayBuffer());
        return Common.GetTypedData(decrypted);
    }
}