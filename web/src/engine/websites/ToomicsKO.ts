import { Tags } from '../Tags';
import icon from './ToomicsKO.webp';
import { type MangaPlugin } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, Manga } from '../providers/MangaPlugin';
import { Fetch, FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Toomics from './decorators/ToomicsBase';
import * as Common from './decorators/Common';

type TPagingData = {
    iInsertIdx: string
}
function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: [
            anchor.querySelector<HTMLDivElement>('div.ep__episode').textContent.trim(),
            anchor.querySelector<HTMLElement>('strong.ep__title').textContent.trim()
        ].join(' ').trim()
    };
}

@Common.ChaptersSinglePageCSS('div.episode__body ul.eps li#eps_not_selected a', ChapterExtractor)
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
        return FetchWindowScript(new Request('https://www.toomics.com/ko'), '');
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
        for (const path of ['/webtoon/weekly', '/webtoon/finish/ord/latest']) {
            for (let page = 1, run = true; run; page++) {
                const mangas: Manga[] = await this.GetMangasFromPage(path, page, provider);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return mangaList.distinct();
    }

    async GetMangasFromPage(path: string, page: number, provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(path, this.URI), {
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
            const id = element.pathname.replace(/bridge\/type\/\d+/, 'episode');
            const title = element.querySelector('.toon__link, .toon__title').textContent.replace(/\u005B[^\u005B\u005D]+\u005D$/, '').trim();
            return new Manga(this, provider, id, title);
        });
    }

    private async FetchRealMangaId(idx: string): Promise<string> {
        //get real toon id
        let result = await this.FetchPOST('/popular/getCutPaging', new URLSearchParams({
            cut_idx: idx,
            cut_gender: '',
            cut_type: 'P',
            ord: 'update'
        }).toString());
        const pagingData: TPagingData = JSON.parse(result);

        result = await this.FetchPOST('/popular/getCutItem', new URLSearchParams({
            cut_idx: idx,
            history_idx: pagingData.iInsertIdx,
            ord: 'update'
        }).toString());
        return '/webtoon/episode/toon/' + result.match(/toon_idx\/(\d+)/).at(1);
    }

    private async FetchPOST(path: string, params: string): Promise<string> {
        const request = new Request(new URL(path, this.URI), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        const response = await Fetch(request);
        return response.text();
    }
}