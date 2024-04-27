import { Tags } from '../Tags';
import icon from './Manhuaren.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as DM5 from './decorators/DM5';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangasResults = {
    UpdateComicItems: APIManga[]
}

type APIManga = {
    Title: string,
    UrlKey: string,
}

@Common.MangaCSS(/^{origin}\/manhua-[^/]+\//, 'div.detail-main-info p.detail-main-info-title')
@Common.ChaptersSinglePageCSS('ul#detail-list-select-1 li a.chapteritem')
@DM5.PagesSinglePageScript()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaren', 'Manhuaren 漫画人', 'https://manhuaren.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList.distinct();
    }

    private async GetMangasFromPage(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const url = new URL('/manhua-list/dm5.ashx', this.URI);
        url.searchParams.set('d', new Date().toString());
        const request = new Request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Referer: this.URI.origin,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                action: 'getclasscomics',
                pageindex: page.toString(),
                pagesize: '200',
                categoryid: '0',
                tagid: '0',
                status: '0',
                usergroup: '0',
                pay: '-1',
                areaid: '0',
                sort: '10',
                iscopyright: '0'
            }).toString(),
        });

        const { UpdateComicItems } = await FetchJSON<APIMangasResults>(request);
        return UpdateComicItems ? UpdateComicItems.map(manga => new Manga(this, provider, `/${manga.UrlKey}/`, manga.Title.trim())): [];
    }
}