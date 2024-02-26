import { type Tag, Tags } from '../Tags';
import icon from './SixParkbbsClub.webp';
import type { Chapter, Page} from '../providers/MangaPlugin';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowCSS } from '../platform/FetchProvider';

@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    //FetchManga
    protected mangaRegex = /^{origin}\/enter6\/index\.php\?app=forum&act=threadview&tid=\d+/;
    protected queryMangaTitle = 'td.show_content font b';

    //FetchMangas
    protected sub = '/enter6';
    protected path = '/index.php?app=forum&act=list&pre=55764&nowpage={page}&start=55764';
    protected queryManga = 'div#d_list ul li a:nth-child(1)';
    protected queryMatch = /(【(连载|英肉|短篇|生肉|韩肉)】.*)|(\[连载\].*)/;

    //Fetchpages
    protected queryPages = 'td.show_content pre img';
    public constructor( identifier: string = 'sixparkbbsclub', title: string = '6parkbbs Club (新❀华漫)', url: string = 'https://club.6parkbbs.com', tags: Tag[] = [Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator]) {
        super(identifier, title, url, ...tags);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        const source = this.mangaRegex.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
        return new RegExp(source, this.mangaRegex.flags).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return Common.FetchMangaCSS.call(this, provider, url, this.queryMangaTitle, this.MangaLabelExtractor, true);
    }

    private MangaLabelExtractor(element: HTMLAnchorElement) {
        return element.textContent.replaceAll(/\[[^\]]+\]/g, '').replaceAll(/【[^】]+】/g, '').trim();
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList : Manga [] = [];

        //fetch pages count (because we must continue despites empty pages)
        const url = new URL(this.sub + this.path.replace('{page}', '1000'), this.URI).href;//great page number to make sure we get last
        const data = await FetchWindowCSS<HTMLAnchorElement>(new Request(url), 'div#d_list_page a:nth-last-child(2)');
        const pageMaxUrl = new URL(data[0].href);
        const pageMax = parseInt(pageMaxUrl.searchParams.get('p') || pageMaxUrl.searchParams.get('nowpage'));

        for (let page = 0; page < pageMax; page += 1) {
            const url = new URL(this.sub + this.path.replace('{page}', `${page}`), this.URI).href;
            const data = await FetchWindowCSS<HTMLAnchorElement>(new Request(url), this.queryManga);//If not using FetchWindowCSS we always fetch the same page
            if (!data || data.length == 0) continue;
            const mangas = data
                .filter(element => this.queryMatch.test(element.text))
                .map(element => {
                    const title = this.MangaLabelExtractor(element);
                    return new Manga(this, provider, element.pathname + element.search, title);
                });
            if (mangas.length > 0 && !Common.EndsWith(mangaList, mangas)) mangaList.push(...mangas);
        }
        return mangaList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return Common.FetchPagesSinglePageCSS.call(this, chapter, this.queryPages, this.PagesExtractor);
    }

    private PagesExtractor(element: HTMLImageElement): string {
        return element.getAttribute('mydatasrc') || element.getAttribute('src');
    }
}