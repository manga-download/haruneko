import { Tags } from '../Tags';
import icon from './SoftKomik.webp';
import * as Common from './decorators/Common';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIMangaDetails = {
    pageProps: {
        data: APIManga;
    }
};

type APIChapterDetails = {
    pageProps: {
        data: {
            data: {
                _id: number;
            }
        };
    }
};

type APIManga = {
    title: string;
    title_slug: string;
};

type APIChapters = {
    chapter: {
        chapter: string;
    }[]
};

type APIMangas = {
    data: APIManga[];
};

type APIPages = {
    imageSrc: string[];
};

type TokenData = {
    token: string;
    sign: string;
    ex: number;
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private nextBuild = '';
    private readonly CDNURL = 'https://cd1.softkomik.online/softkomik/';
    private readonly apiUrl = 'https://v2.softdevices.my.id/';
    private token: TokenData = undefined;

    public constructor() {
        super('softkomik', 'Softkomik', 'https://softkomik.co', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nextBuild = await FetchWindowScript<string>(new Request(this.URI), `__NEXT_DATA__.buildId`, 5000);
        await this.RefreshToken();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').at(-1);
        const { pageProps: { data: { title, title_slug } } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`/_next/data/${this.nextBuild}/${slug}.json`, this.URI)));
        return new Manga(this, provider, title_slug, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run && page; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./komik?page=${page}&limit=1000&sortBy=new`, this.apiUrl)));
                const mangas = data.map(({ title, title_slug: slug }) => new Manga(this, provider, slug, title.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapter: chapters } = await this.FetchSigned<APIChapters>(`./komik/${manga.Identifier}/chapter?limit=9999999`);
        return chapters.map(({ chapter }) => new Chapter(this, manga, `/${manga.Identifier}/chapter/${chapter}`, chapter)).distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pageProps: { data: { data: { _id } } } } = await FetchJSON<APIChapterDetails>(new Request(new URL(`/_next/data/${this.nextBuild}/${chapter.Identifier}.json`, this.URI)));
        const { imageSrc } = await this.FetchSigned<APIPages>(`./komik${chapter.Identifier}/img/${_id}`);
        return imageSrc.map(image => new Page(this, chapter, new URL(`${this.CDNURL}${image}`), { Referer: this.URI.href }));
    }

    private async RefreshToken(): Promise<void> {
        if (this.token?.ex < Date.now()) return;
        this.token = await FetchJSON<TokenData>(new Request(new URL('./api/sessions', this.URI)));
    }

    private async FetchSigned<T extends JSONElement>(endpoint: string): Promise<T> {
        await this.RefreshToken();
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            credentials: 'include',
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'X-Token': this.token.token,
                'X-Sign': this.token.sign
            }
        }));
    }
}