import { Tags } from '../Tags';
import icon from './NekoPost.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, type Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIMangas = {
    listProject: {
        pid: number;
        projectName: string;
        projectType: string;
    }[];
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

const mangaScript = `document.querySelector('h1')?.textContent.trim();`;

const pageScript = `
    new Promise(async resolve => {
        let sources = [];
        for(let index = 0; index < 60; index++) {
            const images = [...document.querySelectorAll('img[alt^="page "]')];
            window.scrollTo(0, document.documentElement.scrollHeight * (index + 1) / 60);
            await new Promise(done => setTimeout(done, 100));
            sources = images.map(image => image.src).filter(source => source && source !== location.href);
            if(images.length > 0 && sources.length === images.length) break;
        }
        resolve(sources);
    });
`;

@Common.ChaptersSinglePageJS(chapterScript, 3000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://nekopost.net/api/';
    public constructor() {
        super('nekopost', 'NekoPost', 'https://www.nekopost.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const title = await FetchWindowScript<string>(new Request(uri), mangaScript, 3000);
        return new Manga(this, provider, uri.pathname, title.trim());
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
            const { listProject } = await FetchJSON<APIMangas>(new Request(new URL('./project/search', this.apiUrl), {
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
            }));
            return listProject.filter(({ projectType }) => projectType === 'c' || projectType === 'm')
                .map(({ pid, projectName, projectType }) => new Manga(this, provider, `/${projectType == 'c' ? 'comic' :'manga'}/${pid}`, projectName));
        } catch {
            return [];
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript);
        return images.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }

}
