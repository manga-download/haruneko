import { Tags } from '../Tags';
import icon from './ReaperScans.webp';
import { type MangaPlugin, DecoratableMangaScraper, Manga, Chapter, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Priority, TaskPool } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { Numeric } from '../SettingsManager';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> ={
    data : T
}

type APIManga = {
    id: number
    title: string,
}

type APIChapter = {
    chapter_slug: string,
    chapter_name: string
    series: {
        series_slug : string
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly interactionTaskPool = new TaskPool(1, new RateLimit(15, 60));
    private readonly apiUrl = 'https://api.reaperscans.com';

    public constructor() {
        super('reaperscans', 'Reaper Scans', 'https://reaperscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
        this.Settings.throttle = new Numeric('throttle.interactive', R.Plugin_Settings_ThrottlingInteraction, R.Plugin_Settings_ThrottlingInteractionInfo, 15, 1, 60);
        (this.Settings.throttle as Numeric).Subscribe(value => this.interactionTaskPool.RateLimit = new RateLimit(value, 60));
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.match(/\/series\/([^/]+)/)[1];
        const manga = await this.interactionTaskPool.Add(async () => FetchJSON<APIManga>(new Request(new URL(`/series/${slug}`, this.apiUrl))), Priority.Normal);
        return new Manga(this, provider, manga.id.toString(), manga.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page += 1) {
            const mangas = await this.interactionTaskPool.Add(async () => this.GetMangasFromPage(page, provider), Priority.Normal);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`/query?page=${page}&perPage=100&series_type=Comic&adult=true`, this.apiUrl)));
        return data.map(item => new Manga(this, provider, item.id.toString(), item.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.interactionTaskPool.Add(async () => this.GetChaptersFromPage(manga, page), Priority.Normal);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;

    }
    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`/chapter/query?page=${page}&perPage=100&series_id=${manga.Identifier}`, this.apiUrl)));
        return data.map(item => new Chapter(this, manga, `/series/${item.series.series_slug}/${item.chapter_slug}`, item.chapter_name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return this.interactionTaskPool.Add(async () => Common.FetchPagesSinglePageCSS.call(this, chapter, 'div.items-center.justify-center > img[data-src]'), Priority.Normal);
    }
}