import { Tags } from '../Tags';
import icon from './ReaperScans.webp';
import { type MangaPlugin, DecoratableMangaScraper, Manga, Chapter, type Page, type MangaScraper } from '../providers/MangaPlugin';
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

function PageLinkExtractor(this: MangaScraper, element: HTMLImageElement): string {
    const url = new URL(element.getAttribute('src'), this.URI);
    return url.searchParams.get('url') ? decodeURIComponent(url.searchParams.get('url')) : url.href;
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly interactionTaskPool = new TaskPool(1, RateLimit.PerMinute(15));
    private readonly apiUrl = 'https://api.reaperscans.com';

    public constructor() {
        super('reaperscans', 'Reaper Scans', 'https://reaperscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
        this.Settings.throttle = new Numeric('throttle.interactive', R.Plugin_Settings_ThrottlingInteraction, R.Plugin_Settings_ThrottlingInteractionInfo, 15, 1, 60).Subscribe(value => this.interactionTaskPool.RateLimit = RateLimit.PerMinute(value));
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').pop();
        const manga = await this.interactionTaskPool.Add(async () => FetchJSON<APIManga>(new Request(new URL(`/series/${slug}`, this.apiUrl))), Priority.Normal);
        return new Manga(this, provider, manga.id.toString(), manga.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const uri = new URL(`/query`, this.apiUrl);
        uri.searchParams.set('perPage', '100');
        uri.searchParams.set('series_type', 'Comic');
        uri.searchParams.set('adult', 'true');
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.interactionTaskPool.Add(async () => this.GetMangasFromPage(uri, page, provider), Priority.Normal);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(uri: URL, page: number, provider: MangaPlugin): Promise<Manga[]> {
        uri.searchParams.set('page', page.toString());
        const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(uri));
        return data.map(item => new Manga(this, provider, item.id.toString(), item.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const uri = new URL(`/chapter/query`, this.apiUrl);
        uri.searchParams.set('perPage', '100');
        uri.searchParams.set('series_id', manga.Identifier);
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.interactionTaskPool.Add(async () => this.GetChaptersFromPage(uri, manga, page), Priority.High);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;

    }
    private async GetChaptersFromPage(uri: URL, manga: Manga, page: number): Promise<Chapter[]> {
        uri.searchParams.set('page', page.toString());
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(uri));
        return data.map(item => new Chapter(this, manga, `/series/${item.series.series_slug}/${item.chapter_slug}`, item.chapter_name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, 'div#content div.container > div img:not([alt *= "thumb"])', PageLinkExtractor);
        return pages.filter(page => !page.Link.href.match(/\._000_slr\.jpg$/));//incorrect image in Solo Leveling Ragnarok chapter 1
    }
}
