import { FetchJSON } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type APIManga = {
    titleName: string,
    webtoonLevelCode: string,
    articleList: APIChapter[]
}

type APIChapter = {
    no: number,
    subtitle: string,
    charge: boolean
}

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
        const { titleName, webtoonLevelCode } = await FetchJSON<APIManga>(new Request(new URL(`./article/list/info?titleId=${titleId}`, this.apiUrl)));
        return new Manga(this, provider, `/${mangaTypeMap.get(webtoonLevelCode)}/list?titleId=${titleId}`, titleName);
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
        const { articleList, webtoonLevelCode } = await FetchJSON<APIManga>(new Request(new URL(`./article/list?titleId=${titleId}&page=${page}`, this.apiUrl)));
        return articleList.filter(chapter => !chapter.charge)
            .map(chapter => new Chapter(this, manga, `/${mangaTypeMap.get(webtoonLevelCode)}/detail?titleId=${titleId}&no=${chapter.no}`, chapter.subtitle));
    }
}