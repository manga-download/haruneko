import { Tags } from '../Tags';
import icon from './NetComics.webp';
import { Chapter, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { WebsiteResourceKey as W } from '../../i18n/ILocale';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { Exception } from '../Error';

type APIResult<T> = {
    status: number,
    message: string,
    data?: T
    error?: ApiError
}

type ApiError = {
    error: {
        status: number
    }
}

type APIManga = {
    title_id: number,
    site: string,
    title_name: string,
}

type APIChapter = {
    chapter_id: number,
    chapter_no: number,
    chapter_name: string
}

type APIPages = {
    images: {
        image_url: string
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://beta-api.netcomics.com/api/v1/';

    public constructor() {
        super('netcomics', `NetComics`, 'https://www.netcomics.com', Tags.Language.English, Tags.Language.Spanish, Tags.Language.French, Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https:\/\/www\.netcomics\.com\/[a-z]{2}\/comic\/[^/]+/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const site = url.match(/\/([a-z]{2})\/comic\//)[1].toUpperCase();
        const slug = url.match(/\/comic\/(\S+)/)[1];
        const request = new Request(new URL(`title/comic/${slug}/${site}`, this.apiUrl), {
            headers: this.CreateRequestHeaders(site)
        });
        const { data } = await FetchJSON<APIResult<APIManga>>(request);
        return new Manga(this, provider, data.title_id.toString(), data.title_name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const languages = ['EN', 'ES', 'FR', 'DE'];
        for (const language of languages) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.GetMangasFromPage(page, provider, language);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }

        return mangaList.distinct();
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, language: string) {
        const request = new Request(new URL(`title/genre?no=${page}&size=18&genre=`, this.apiUrl), {
            headers: this.CreateRequestHeaders(language)
        });
        const { data } = await FetchJSON<APIResult<APIManga[]>>(request);
        return data.map(manga => new Manga(this, provider, manga.title_id.toString(), manga.title_name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`chapter/order/${manga.Identifier}/rent`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(request);
        return data.map(chapter => {
            const title = [chapter.chapter_no.toString(), chapter.chapter_name.trim()].join(' ').trim();
            return new Chapter(this, manga, chapter.chapter_id.toString(), title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`chapter/viewer/625/${chapter.Parent.Identifier}/${chapter.Identifier}?otp=`, this.apiUrl));
        const { data, error } = await FetchJSON<APIResult<APIPages>>(request);
        if (error?.error.status == 400) throw new Exception(W.Plugin_Common_Chapter_UnavailableError);
        return data.images.map(image => new Page(this, chapter, new URL(image.image_url)));

    }

    private CreateRequestHeaders(site: string): HeadersInit {
        return {
            Referer: this.URI.origin,
            Origin: this.URI.origin,
            platform: 'web',
            site: site,
            adult: 'Y',
            did: Date.now().toString()
        };
    }
}