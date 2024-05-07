import { Tags } from '../Tags';
import icon from './Team1x1.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('.tt').textContent.trim();
    return {id, title };
}

@Common.MangasMultiPageCSS('/series?page={page}', 'div.bs div.bsx a', 1, 1, 0, MangaExtractor)
@Common.PagesSinglePageCSS('.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('team1x1', `Team X`, 'https://teamxnovel.com', Tags.Language.Arabic, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
        //this.Settings.url = new Text('urloverride', R.Plugin_Settings_UrlOverride, R.Plugin_Settings_UrlOverrideInfo, this.URI.origin);
        //(this.Settings.url as Text).Subscribe(value => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return await Common.FetchMangaCSS.call(this, provider, url, 'div.author-info-title h1');
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]>{
        const uri = new URL(`${manga.Identifier}?page=${page}`, this.URI);
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.eplister ul li a:not([data-bs-toggle])');
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('.epl-num:nth-of-type(2)').textContent.trim()));
    }
}