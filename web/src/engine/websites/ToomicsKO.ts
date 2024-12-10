import { Tags } from '../Tags';
import icon from './ToomicsKO.webp';
import { Chapter, type MangaPlugin } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, Manga } from '../providers/MangaPlugin';
import { Fetch, FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Toomics from './decorators/Toomics';
import * as Common from './decorators/Common';

type TPagingData = {
    iInsertIdx: string
}

@Common.PagesSinglePageCSS('div.viewer__img img', Toomics.PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly mangaRegex1 = new RegExp(`^${this.URI.origin}/webtoon/episode/toon/\\d+$`); //https://www.toomics.com/webtoon/episode/toon/7676 => /webtoon/episode/toon/7676
    private readonly mangaRegex2 = new RegExp(`^${this.URI.origin}/popular/popular_list/cut_list_idx/\\d+$`);//https://www.toomics.com/popular/popular_list/cut_list_idx/1648 => #1648 => /webtoon/episode/toon/7676
    private readonly mangaRegex3 = new RegExp(`^${this.URI.origin}/webtoon/bridge/type/\\d+/toon/\\d+$`); //https://www.toomics.com/webtoon/bridge/type/2/toon/76766 => /webtoon/episode/toon/7676

    public constructor() {
        super('toomics-ko', `Toomics (Korean)`, 'https://www.toomics.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // NOTE: Open the korean URL to set the 'content_lang' cookie, otherwise 'www.toomics.com' will keep redirecting to 'global.toomics.com'
        return FetchWindowScript(new Request('https://toomics.com/ko'), '');
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegex1.test(url) || this.mangaRegex2.test(url) || this.mangaRegex3.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        //if we have IDX, we must ask to the API the real manga ID
        if (this.mangaRegex2.test(url)) {
            const id = await this.FetchRealMangaId(url.match(/cut_list_idx\/(\d+)$/)[1]);
            url = new URL(id, this.URI).href;
        }
        return Common.FetchMangaCSS.call(this, provider, url.replace(/bridge\/type\/\d+/, 'episode'), 'div.episode__header h2.episode__title');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const path of ['/webtoon/weekly', '/webtoon/finish/ord/latest', '/popular/popular_list/cut_type/P/ord/update']) {
            for (let page = 1, run = true; run; page++) {
                const mangas: Manga[] = await this.GetMangasFromPage(path, page, provider);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        // the popular list contains many duplicates (not detectable by ID) which needs to be removed
        return mangaList.filter((manga, index) => index === mangaList.findIndex(m => m.Title === manga.Title));
    }

    async GetMangasFromPage(path: string, page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL(path, this.URI);
        const request = new Request(uri, {
            method: 'POST',
            body: new URLSearchParams({
                page: page.toString(),
                load_contents: 'Y'
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'li[class*="__li"] > a[class*="toon"]');
        return data.map(element => {
            const id = element.dataset.toggle === 'modal' ? `#${element.id.match(/idx(\d+)$/)[1]}` : element.pathname.replace(/bridge\/type\/\d+/, 'episode');
            const title = element.querySelector('div.toon-dcard__caption strong.toon-dcard__title, div.toon__caption span.toon__subtitle').textContent.replace(/\u005B[^\u005B\u005D]+\u005D$/, '').trim();
            return new Manga(this, provider, id, title);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (/#\d+$/.test(manga.Identifier)) {
            const realMangaId = await this.FetchRealMangaId(manga.Identifier.split('#')[1]);
            const fakemanga = new Manga(this, manga.Parent as MangaPlugin, realMangaId, manga.Title);
            const chapters = await Toomics.FetchChaptersSinglePageCSS.call(this, fakemanga, 'div.episode__body ul.eps li.eps__li:not(.chk_ep) a');
            return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title));

        } else return Toomics.FetchChaptersSinglePageCSS.call(this, manga, 'div.episode__body ul.eps li.eps__li:not(.chk_ep) a');

    }

    async FetchRealMangaId(idx: string): Promise<string> {
        //get real toon id
        let result = await this.FetchPOST('/popular/getCutPaging', new URLSearchParams({
            cut_idx: idx,
            cut_gender: '',
            cut_type: 'P',
            ord: 'update'
        }));
        const pagingData: TPagingData = JSON.parse(result);

        result = await this.FetchPOST('/popular/getCutItem', new URLSearchParams({
            cut_idx: idx,
            history_idx: pagingData.iInsertIdx,
            ord: 'update'
        }));
        return '/webtoon/episode/toon/' + result.match(/toon_idx\/(\d+)/)[1];
    }

    async FetchPOST(path: string, data: URLSearchParams): Promise<string> {
        const uri = new URL(path, this.URI);
        const request = new Request(uri, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });
        const response = await Fetch(request);
        return response.text();
    }

}