import { Tags } from '../Tags';
import icon from './BilibiliManhua.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import { Choice } from '../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../i18n/ILocale';
import { Fetch } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

import { DRMProvider } from './BilibiliManhua.DRM.js';

type APIResult<T> = {
    data: T
};

type APIMangas = APIResult<{
    season_id: number,
    title: string
}[]>;

type APIChapters = APIResult<{
    id: number,
    title: string,
    ep_list: {
        id: number,
        is_locked: boolean,
        is_in_free: boolean,
        short_title: string,
        title: string
    }[]
}>;

type APIPages = APIResult<{
    images: {
        x: number,
        path: string,
    }[]
}>;

type APIImageTokens = APIResult<{
    url: string,
    token: string,
    complete_url: string,
    hit_encrpyt: boolean
}[]>;

type PageParam = {
    index: number
}

export default class extends DecoratableMangaScraper {

    #drm: DRMProvider;
    private readonly mangasSequentialTaskPool = new TaskPool(1, new RateLimit(4, 1));
    private readonly imageFormat = new Choice('image.format',
        W.Plugin_Settings_ImageFormat,
        W.Plugin_Settings_ImageFormatInfo,
        '.png',
        { key: '.png', label: E.Settings_Global_Format_PNG },
        { key: '.jpeg', label: E.Settings_Global_Format_JPEG },
        { key: '.webp', label: E.Settings_Global_Format_WEBP },
    );

    public constructor() {
        super('bilibilimanhua', `哔哩哔哩 漫画 (Bilibili Manhua)`, 'https://manga.bilibili.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Official);
        this.Settings.imageFormat = this.imageFormat;
        this.imageTaskPool.RateLimit = new RateLimit(1, 1);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        super.Initialize();
        this.#drm = new DRMProvider();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/detail/mc([\\d]+)`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { id, title } } = await this.#drm.FetchTwirp<APIChapters>(new URL(url), 'ComicDetail', {
            comic_id: parseInt(url.match(/\/mc(\d+)/).at(1))
        });
        return new Manga(this, provider, id.toString(), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const cancellator = new AbortController();
        try {
            const mangaList: Manga[] = [];
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.mangasSequentialTaskPool.Add(() => this.GetMangasFromPage(page, provider), Priority.Low, cancellator.signal);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
            return mangaList;
        } finally {
            cancellator.abort();
        }
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.#drm.FetchTwirp<APIMangas>(new URL('/classify?styles=-1&areas=-1&status=-1&prices=-1&orders=0&special=0', this.URI), 'ClassPage', {
            style_id: -1,
            area_id: -1,
            is_free: -1,
            is_finish: -1,
            order: 0,
            page_size: 500,
            page_num: page
        });
        return data.map(entry => new Manga(this, provider, entry.season_id.toString(), entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { ep_list } } = await this.#drm.FetchTwirp<APIChapters>(new URL(`/detail/mc${manga.Identifier}`, this.URI), 'ComicDetail', {
            comic_id: parseInt(manga.Identifier)
        });
        return ep_list
            .filter(entry => entry.is_in_free || !entry.is_locked)
            .map(entry => new Chapter(this, manga, entry.id.toString(), [entry.short_title, entry.title].join(' - ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParam>[]> {
        const chapterUrl = new URL(`/detail/mc${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI);
        const { data: { images } } = await this.#drm.FetchTwirp<APIPages>(chapterUrl, 'GetImageIndex', { ep_id: chapter.Identifier });
        const { data } = await this.#drm.FetchTwirp<APIImageTokens>(chapterUrl, 'ImageToken', {
            m1: await this.#drm.GetPublicKey(),
            urls: this.#drm.CreateImageLinks(this.URI.origin, this.imageFormat.Value, images)
        }, false);
        return data.map(({ complete_url: x, url, token }, index) => {
            const pageurl = new URL(x ?? `${url}?token=${token}`);
            pageurl.searchParams.set('code', 'DanmakuInfo');
            return new Page<PageParam>(this, chapter, pageurl, { index });
        });
    }

    public override async FetchImage(page: Page<PageParam>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const chapterUrl = new URL(`/mc${page.Parent.Parent.Identifier}/${page.Parent.Identifier}`, this.URI).href;
        return this.imageTaskPool.Add(async () => {
            const blob = await (await Fetch(new Request(page.Link))).blob();
            return blob.type.startsWith('image/') ? blob : Common.GetTypedData(await this.#drm.FetchImageData(page.Link.href, page.Parameters.index, chapterUrl));
        }, priority, signal);
    }
}