import { Tags } from '../Tags';
import icon from './TappyToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type MangaID = {
    id: string,
    language: string
}

type NextData = {
    props: {
        initialProps: {
            pageProps: {
                comic: APIManga
            }
        },
        initialState: {
            axios: {
                headers: {
                    Authorization: string,
                    'X-Device-Uuid': string
                }
            }
        }
    }
}

type APIManga = {
    id: number,
    title: string,
    isSuperHighQualitySupported: boolean,
    locale: string
}

type APIChapter = {
    id: number,
    title: string,
    isAccessible: boolean,
    isFree: boolean,
    isUserUnlocked: boolean,
    isUserRented: boolean,
}

type APIPages = {
    files: {
        url: string
    }[]
}

const mangaLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['fr', Tags.Language.French],
    ['de', Tags.Language.German],
]);

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private bearer: string = undefined;
    private deviceId: string = undefined;
    private readonly apiUrl = 'https://api-global.tappytoon.com';

    public constructor() {
        super('tappytoon', 'TappyToon', 'https://www.tappytoon.com', Tags.Media.Manhwa, Tags.Language.English, Tags.Language.French, Tags.Language.German, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[a-z]{2}/book/[^/]+$`).test(url);
    }

    public override async Initialize(): Promise<void> {
        const { props: { initialState: { axios: { headers } } } } = await this.GetNextData(new URL(this.URI));
        this.bearer = headers.Authorization;
        this.deviceId = headers['X-Device-Uuid'];
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { props: { initialProps: { pageProps: { comic: { id, title, locale } } } } } = await this.GetNextData(new URL(url));
        const mangaId = JSON.stringify({ id: id.toString(), language: locale });
        return new Manga(this, provider, mangaId, title.trim(), mangaLanguageMap.get(locale) ?? Tags.Language.English);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const language of mangaLanguageMap.keys()) {
            const mangas = await FetchJSON<APIManga[]>(this.CreateRequest(new URL(`/comics?locale=${language}`, this.apiUrl), language));
            mangaList.push(...mangas.map(manga => {
                const id = JSON.stringify({ id: manga.id.toString(), language });
                return new Manga(this, provider, id, manga.title.trim(), mangaLanguageMap.get(manga.locale) ?? Tags.Language.English);
            }));
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { language, id } = JSON.parse(manga.Identifier) as MangaID;
        const chapters = await FetchJSON<APIChapter[]>(this.CreateRequest(new URL(`/comics/${id}/chapters?limit=9999&skipAgeRestriction=true&locale=${language}`, this.apiUrl), language));
        return chapters.filter(chapter => chapter.isAccessible && (chapter.isFree || chapter.isUserUnlocked || chapter.isUserRented))
            .map(chapter => new Chapter(this, manga, chapter.id.toString(), chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { language, id } = JSON.parse(chapter.Parent.Identifier) as MangaID;
        const { isSuperHighQualitySupported } = await FetchJSON<APIManga>(this.CreateRequest(new URL(`/comics/${id}&locale=${language}`, this.apiUrl), language));
        const url = new URL(`/content-delivery/contents/manifest?chapterId=${chapter.Identifier}`, this.apiUrl);
        url.searchParams.set('variant', isSuperHighQualitySupported ? 'super_high' : 'high');
        url.searchParams.set('canAcceptSignedCookie', 'true');
        url.searchParams.set('locale', language);
        const { files } = await FetchJSON<APIPages>(this.CreateRequest(url, language));
        return files.map(page => new Page(this, chapter, new URL(page.url)));
    }

    private async GetNextData(url: URL, language: string = 'en'): Promise<NextData> {
        return await FetchWindowScript<NextData>(this.CreateRequest(url, language), '__NEXT_DATA__', 2000);
    }

    private CreateRequest(url: URL, language: string): Request {
        return new Request(url, {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'Accept-Language': language,
                Authorization: this.bearer,
                'X-Device-Uuid': this.deviceId
            }
        });
    }
}