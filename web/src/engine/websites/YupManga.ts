import { Tags } from '../Tags';
import { Exception } from '../Error';
import { EngineResourceKey as R } from '../../i18n/ILocale';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import { RateLimit } from '../taskpool/RateLimit';
import icon from './YupManga.webp';
import * as Common from './decorators/Common';
import { DRMProvider } from './YupManga.DRM';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

type ChapterIdentifier = { key: number, page: number };

AddAntiScrapingDetection(async invoke => {
    return await invoke(`
        new Promise(resolve => {
            setTimeout(() => {
                if (location.pathname === '/box-modal.php') {
                    resolve(${FetchRedirection.Interactive});
                } else {
                    resolve(${FetchRedirection.None});
                }
            }, 2500);
        });
    `);
}, /^https:\/\/www\.yupmanga\.com\/reader/);

@Common.MangaCSS(/^{origin}\/series\.php\?id=/, 'div.container div.flex h1', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.comic-card a', Common.PatternLinkGenerator('/?page={page}'), 0, anchor => ({ id: anchor.pathname + anchor.search, title: anchor.querySelector('img').alt.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor() {
        super('yupmanga', 'YupManga', 'https://www.yupmanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
        this.imageTaskPool.RateLimit = new RateLimit(2, 2);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = new URL(manga.Identifier, this.URI).searchParams.get('id');
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { html } = await FetchJSON<{ html: string }>(new Request(new URL(`./ajax/load_chapters.php?series_id=${mangaId}&page=${page}&order=newest_first&_=${Date.now()}`, this.URI)));
                const elements = new DOMParser().parseFromString(html, 'text/html').querySelectorAll<HTMLAnchorElement>('div.comic-card a');
                const chapters = [...elements].map(anchor => {
                    const id = JSON.stringify(<ChapterIdentifier>{
                        key: parseFloat(anchor.dataset['chapter-key']),
                        page: parseInt(anchor.dataset.page, 10),
                    });
                    return new Chapter(this, manga, id, anchor.querySelector<HTMLImageElement>('img').alt.trim());
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { key, page } = <ChapterIdentifier>JSON.parse(chapter.Identifier);
        const response = await this.#drm.CreatePageLinks(new URL(chapter.Parent.Identifier, this.URI), key, page);
        if (response.status === 429) throw new Exception(R.FetchProvider_Fetch_TooManyRequests);
        return (<string[]>await response.json()).map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }
}