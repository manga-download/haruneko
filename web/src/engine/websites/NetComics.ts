import { Tags } from '../Tags';
import icon from './NetComics.webp';
import { Chapter, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { Choice } from '../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W, TagResourceKey as R } from '../../i18n/ILocale';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    status: number,
    message: string,
    data: T
}

type APIManga = {
    title_id: string,
    site: string,
    title_name: string,
    //title_slug: string
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
    private readonly apiUrl = 'https://beta-api.netcomics.com';

    public constructor() {
        super('netcomics', `NetComics`, 'https://www.netcomics.com', Tags.Language.English, Tags.Language.Japanese, Tags.Language.Chinese, Tags.Language.Korean,
            Tags.Language.Spanish, Tags.Language.French, Tags.Language.German, Tags.Language.Indonesian, Tags.Language.Thai, Tags.Language.Vietnamese,
            Tags.Media.Manhwa, Tags.Source.Official);

        this.Settings.language = new Choice('mangalist.language',
            E.Settings_Global_Language,
            E.Settings_Global_LanguageInfo,
            'EN',
            { key: 'EN', label: R.Tags_Language_English },
            //{ key: 'JA', label: R.Tags_Language_Japanese },
            //{ key: 'CN', label: R.Tags_Language_Chinese },
            //{ key: 'KO', label: R.Tags_Language_Korean },
            { key: 'ES', label: R.Tags_Language_Spanish },
            { key: 'FR', label: R.Tags_Language_French },
            { key: 'DE', label: R.Tags_Language_German },
            //{ key: 'ID', label: R.Tags_Language_Indonesian },
            //{ key: 'TH', label: R.Tags_Language_Thai },
            //{ key: 'VI', label: R.Tags_Language_Vietnamese }
        );

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
        const request = new Request(new URL(`/api/v1/title/comic/${slug}/${site}`, this.apiUrl), {
            headers: this.getRequestHeaders(site)
        });
        const { data } = await FetchJSON<APIResult<APIManga>>(request);
        return new Manga(this, provider, data.title_id, data.title_name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList : Manga[]= [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList.distinct();
    }

    async getMangasFromPage(page: number, provider: MangaPlugin) {
        const request = new Request(new URL(`/api/v1/title/genre?no=${page}&size=18&genre=`, this.apiUrl), {
            headers: this.getRequestHeaders(this.Settings.language.Value as string)
        });
        const { data } = await FetchJSON<APIResult<APIManga[]>>(request);
        return data.map(manga => new Manga(this, provider, manga.title_id, manga.title_name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/api/v1/chapter/order/${manga.Identifier}/rent`, this.apiUrl));
        const { data } = await FetchJSON <APIResult<APIChapter[]>>(request);
        return data.map(chapter => {
            const title = ['Chapter', chapter.chapter_no.toString(), chapter.chapter_name.trim()].join(' ').trim();
            return new Chapter(this, manga, chapter.chapter_id.toString(), title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        try {
            const request = new Request(new URL(`/api/v1/chapter/viewer/625/${chapter.Parent.Identifier}/${chapter.Identifier}?otp=`, this.apiUrl));
            const { data } = await FetchJSON<APIResult<APIPages>>(request);
            return data.images.map(image => new Page(this, chapter, new URL(image.image_url)));
        } catch (e) {
            throw Error(W.Plugin_Common_Chapter_UnavailableError);
        }
    }

    getRequestHeaders(site: string): HeadersInit {
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