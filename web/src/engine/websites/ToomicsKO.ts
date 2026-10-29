import { Tags } from '../Tags';
import icon from './ToomicsKO.webp';
import { type MangaPlugin, Manga } from '../providers/MangaPlugin';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { ToomicsBase } from './templates/ToomicsBase';

type TPagingData = {
    iInsertIdx: string;
};

export default class extends ToomicsBase {

    private mangaRegexpArray = [
        new RegExp(`^${this.URI.origin}/webtoon/episode/toon/\\d+$`), //https://www.toomics.com/webtoon/episode/toon/7676 => /webtoon/episode/toon/7676
        new RegExp(`^${this.URI.origin}/popular/popular_list/cut_list_idx/\\d+$`), //https://www.toomics.com/popular/popular_list/cut_list_idx/1648 => #1648 => /webtoon/episode/toon/7676
        new RegExp(`^${this.URI.origin}/webtoon/bridge/type/\\d+/toon/\\d+$`), //https://www.toomics.com/webtoon/bridge/type/2/toon/76766 => /webtoon/episode/toon/7676
    ];

    public constructor() {
        super('toomics-ko', 'Toomics (Korean)', 'https://www.toomics.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // NOTE: Open the korean URL to set the 'content_lang' cookie, otherwise 'www.toomics.com' will keep redirecting to 'global.toomics.com'
        return FetchWindowScript(new Request('https://www.toomics.com/ko'), '');
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexpArray.some(regex => regex.test(url));
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        //if we have IDX, we must ask to the API the real manga ID
        if (/cut_list_idx/.test(url)) {
            const id = await this.FetchRealMangaId(url.match(/cut_list_idx\/(\d+)$/).at(1));
            url = new URL(id, this.URI).href;
        }
        return Common.FetchMangaCSS.call(this, provider, url.replace(/bridge\/type\/\d+/, 'episode'), 'div.episode__header h2.episode__title');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (const path of ['/webtoon/weekly', '/webtoon/finish/ord/latest']) {
                for (let page = 1, run = true; run; page++) {
                    const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(path, this.URI), {
                        method: 'POST',
                        body: new URLSearchParams({
                            page: `${page}`,
                            load_contents: 'Y'
                        }).toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }), 'li[class*="__li"] > a[class*="toon"]');
                    const mangas = elements.map(element => {
                        return new Manga(this, provider, element.pathname.replace(/bridge\/type\/\d+/, 'episode'), element.querySelector('.toon__link, .toon__title').textContent.replace(/\u005B[^\u005B\u005D]+\u005D$/, '').trim());
                    });
                    mangas.length > 0 ? yield* mangas : run = false;
                }
            }
        }.call(this))).distinct();
    }

    private async FetchRealMangaId(idx: string): Promise<string> {
        const requestInit: RequestInit = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        requestInit.body = new URLSearchParams({
            cut_idx: idx,
            cut_gender: '',
            cut_type: 'P',
            ord: 'update'
        }).toString();
        const { iInsertIdx } = await FetchJSON<TPagingData>(new Request(new URL('/popular/getCutPaging', this.URI), requestInit));

        requestInit.body = new URLSearchParams({
            cut_idx: idx,
            history_idx: iInsertIdx,
            ord: 'update'
        }).toString();
        const [anchor] = await FetchCSS<HTMLAnchorElement>(new Request(new URL('/popular/getCutItem', this.URI), requestInit), 'div.snapshot__caption a');
        return `/webtoon/episode/toon/${anchor.pathname.split('/').at(-1)}`;
    }
}