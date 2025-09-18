import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchJSON, FetchRegex } from '../platform/FetchProvider';
import { MangaScraper, type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIMangas = {
    listProject: {
        pid: number;
        projectName: string;
    }[]
};

const chapterScript = `
    new Promise ( resolve => {
        resolve( [...document.querySelectorAll('a.chapter-link')].map(chapter => {
            return {
                id: chapter.pathname,
                title : chapter.querySelector('dt').textContent.trim()
            }
        }));
    });
`;

@Common.ChaptersSinglePageJS(chapterScript, 1500)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://nekopost.net/api/';

    public constructor() {
        super('nekopost', 'NekoPost', 'https://nekopost.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {

    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await Delay(200);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            const request = new Request(new URL('./project/search', this.apiUrl), {
                method: 'POST',
                body: JSON.stringify({
                    genre: [],
                    status: 0,
                    specialType: [],
                    orderBy: 'updateDate',
                    paging: { pageNo: page, pageSize: 200 }
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const { listProject } = await FetchJSON<APIMangas>(request);
            return listProject.map(manga => new Manga(this, provider, `/manga/${manga.pid}`, manga.projectName));
        } catch {
            return [];
        }

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {

    }

}