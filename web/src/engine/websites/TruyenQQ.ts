import { Tags } from '../Tags';
import icon from './TruyenQQ.webp';
import type { Chapter} from '../providers/MangaPlugin';
import { type MangaPlugin, DecoratableMangaScraper, type Manga, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Priority, TaskPool } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { Numeric } from '../SettingsManager';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<string[]>(`[...document.querySelectorAll('script')].map(script => script.text)`);
    return result.some(script => /window\.captcha\s*=/.test(script) && /chaitin\.cn\/captcha\/api/.test(script)) ? FetchRedirection.Automatic : undefined;
});

function PageExtractor(element: HTMLElement): string {
    return element.dataset.original;
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly interactionTaskPool = new TaskPool(1, RateLimit.PerMinute(30));

    public constructor() {
        super('truyenqq', 'TruyenQQ', 'https://truyenqqto.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
        this.Settings.throttle = new Numeric('throttle.interactive', R.Plugin_Settings_ThrottlingInteraction, R.Plugin_Settings_ThrottlingInteractionInfo, 30, 1, 60).Subscribe(value => this.interactionTaskPool.RateLimit = RateLimit.PerMinute(value));
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/truyen-tranh/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return this.interactionTaskPool.Add(async () => Common.FetchMangaCSS.call(this, provider, url, 'h1[itemprop="name"]'), Priority.Normal);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page += 1) {
            const mangas = await this.interactionTaskPool.Add(async () => Common.FetchMangasSinglePageCSS.call(this, provider, `/truyen-moi-cap-nhat/trang-${page}.html`, 'ul.list_grid li h3 a'), Priority.Low);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return this.interactionTaskPool.Add(async () => Common.FetchChaptersSinglePageCSS.call(this, manga, 'div.works-chapter-item div.name-chap a'), Priority.Normal);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return this.interactionTaskPool.Add(async () => Common.FetchPagesSinglePageCSS.call(this, chapter, 'div.page-chapter img.lazy', PageExtractor), Priority.Normal);
    }
}