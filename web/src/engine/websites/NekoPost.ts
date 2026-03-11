import { Tags } from '../Tags';
import icon from './NekoPost.webp';
import { FetchJSON, FetchRegex, FetchWindowScript } from '../platform/FetchProvider';
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

type APIChapter = {
    chapterId: string;
    projectId: string;
    pageItem: {
        pageName: string;
        pageNo: number;
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

const pageScript = `
    new Promise( resolve => {
        window.decodeURIComponent = new Proxy(window.decodeURIComponent, {
          apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            try{
                const jsonData = JSON.parse(result);
                if (jsonData.pageItem) resolve(jsonData);
            } catch{}

            return result;
          }
        });
    });
`;

@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://nekopost.net/api/';
    private readonly CDNUrl = 'https://www.osemocphoto.com';

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
        const [title] = await FetchRegex(new Request(uri), /projectName:"([^"]+)"/g);
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
            return listProject.filter(manga => manga.projectType === 'c' || manga.projectType === 'm')
                .map(({ pid, projectName, projectType }) => new Manga(this, provider, `/${projectType == 'c' ? 'comic' :'manga'}/${pid}`, projectName));
        } catch {
            return [];
        }

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pageItem, chapterId, projectId } = await FetchWindowScript<APIChapter>(new Request(new URL(chapter.Identifier, this.URI)), pageScript);
        return pageItem.sort((self, other) => self.pageNo - other.pageNo)
            .map(({ pageName }) => new Page(this, chapter, new URL(`./collectManga/${projectId}/${chapterId}/${pageName}`, this.CDNUrl)));
    }

}