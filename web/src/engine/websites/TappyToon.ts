import { Tags } from '../Tags';
import icon from './TappyToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

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
    isSuperHighQualitySupported: boolean
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

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    protected language = 'en';
    private bearer: string = undefined;
    private deviceid = undefined;
    private readonly apiUrl = 'https://api-global.tappytoon.com';

    public constructor(id = 'tappytoon', label = 'TappyToon', url = 'https://www.tappytoon.com', tags = [Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Official]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/${this.language}/book/[^/]+$`).test(url);
    }

    public override async Initialize(): Promise<void> {
        const { props: { initialState: { axios: { headers } } } } = await this.GetNextData(new URL(this.URI));
        this.bearer = headers.Authorization;
        this.deviceid = headers['X-Device-Uuid'];
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { props: { initialProps: { pageProps: { comic } } } } = await this.GetNextData(new URL(url));
        return new Manga(this, provider, comic.id.toString(), comic.title.replace(/(\[(FR|DE)\])$/, '').trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const comics = await FetchJSON<APIManga[]>(this.CreateRequest(new URL(`/comics?locale=${this.language}`, this.apiUrl)));
        return comics.map(comic => new Manga(this, provider, comic.id.toString(), comic.title.replace(/(\[(FR|DE)\])$/, '').trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapter[]>(this.CreateRequest(new URL(`/comics/${manga.Identifier}/chapters?limit=9999&skipAgeRestriction=true&locale=${this.language}`, this.apiUrl)));
        return chapters.filter(chapter => chapter.isAccessible && (chapter.isFree || chapter.isUserUnlocked || chapter.isUserRented))
            .map(chapter => new Chapter(this, manga, chapter.id.toString(), chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { isSuperHighQualitySupported } = await FetchJSON<APIManga>(this.CreateRequest(new URL(`/comics/${chapter.Parent.Identifier}&locale=${this.language}`, this.apiUrl)));
        const { files } = await FetchJSON<APIPages>(this.CreateRequest(new URL(`/content-delivery/contents/manifest?chapterId=${chapter.Identifier}&variant=${isSuperHighQualitySupported ? 'super_high' : 'high'}&locale=${this.language}&canAcceptSignedCookie=true`, this.apiUrl)));
        return files.map(page => new Page(this, chapter, new URL(page.url)));
    }

    private async GetNextData(url: URL): Promise<NextData> {
        return await FetchWindowScript<NextData>(this.CreateRequest(url), '__NEXT_DATA__', 2000);
    }

    private CreateRequest(url: URL): Request {
        return new Request(url, {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'Accept-Language': this.language,
                Authorization: this.bearer,
                'X-Device-Uuid': this.deviceid
            }
        });
    }
}