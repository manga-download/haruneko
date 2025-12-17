import { Tags } from '../Tags';
import icon from './AstraToons.webp';
import { Fetch, FetchHTML, FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, type Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    id: number;
    title: string;
    slug: string;
};

type APIMangas = {
    data: APIManga[];
};

@Common.PagesSinglePageCSS('div#reader-container img')

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://new.astratoons.com/api/';

    public constructor() {
        super('astratoons', 'AstraToons', 'https://new.astratoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const doc = await FetchHTML(new Request(new URL(url)));
        return new Manga(this, provider,
            doc.querySelector('main[x-data]').getAttribute('x-data').match(/\d+/).at(0),
            doc.querySelector<HTMLImageElement>('img.object-cover').alt.trim()
        );
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./comics?page=${page}`, this.apiUrl)));
        return data.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const { html } = await FetchJSON<{ html: string }>(new Request(new URL(`./comics/${manga.Identifier}/chapters?page=${page}`, this.apiUrl)));
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return [...doc.querySelectorAll<HTMLAnchorElement>('a')].map(anchor => {
            return new Chapter(this, manga, anchor.pathname, anchor.querySelector<HTMLSpanElement>('span.text-white').textContent.trim());
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(page.Link, {
                headers: {
                    Referer: new URL(page.Parent.Identifier, this.URI).href,
                    'Sec-Fetch-Site': 'same-origin'
                },
            }))).blob();
        }, priority, signal);
    }
}