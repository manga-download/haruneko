import { FetchJSON } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type APIManga = {
    titleName: string;
    titleId: number;
    webtoonLevelCode: string;
    articleList: APIChapter[];
};

type APIChapter = {
    no: number;
    subtitle: string;
    charge: boolean;
};

type APIWeekDaysList = {
    titleListMap: Record<string, APIManga[]>;
};

const mangaTypeMap = new Map([
    ['WEBTOON', 'webtoon'],
    ['BEST_CHALLENGE', 'bestChallenge'],
    ['CHALLENGE', 'challenge'],
]);

@Common.PagesSinglePageCSS('div#comic_view_area div.wt_viewer img[id]')
@Common.ImageAjax()
export class NaverBase extends DecoratableMangaScraper {
    protected apiUrl = 'https://comic.naver.com/api/';

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(webtoon|bestChallenge|challenge)/list\\?titleId=\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const titleId = new URL(url).searchParams.get('titleId');
        const { titleName, webtoonLevelCode } = await this.FetchAPI<APIManga>(`./article/list/info?titleId=${titleId}`);
        return new Manga(this, provider, `/${mangaTypeMap.get(webtoonLevelCode)}/list?titleId=${titleId}`, titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { titleListMap } = await this.FetchAPI<APIWeekDaysList>(`./webtoon/titlelist/weekday`);
        return Object.values(titleListMap).reduce((accumulator: Manga[], dailyMangas) => {
            const mangas = dailyMangas.map(({ titleId, titleName }) => new Manga(this, provider, `/webtoon/list?titleId=${titleId}`, titleName));
            accumulator.push(...mangas);
            return accumulator;
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapterList.isMissingLastItemFrom(chapters) ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const titleId = new URL(manga.Identifier, this.URI).searchParams.get('titleId');
        const { articleList, webtoonLevelCode } = await this.FetchAPI<APIManga>(`./article/list?titleId=${titleId}&page=${page}`);
        return articleList.filter(chapter => !chapter.charge)
            .map(({ no, subtitle }) => new Chapter(this, manga, `/${mangaTypeMap.get(webtoonLevelCode)}/detail?titleId=${titleId}&no=${no}`, subtitle));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl)));
    }
}