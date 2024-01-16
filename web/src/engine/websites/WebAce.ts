import { Tags } from '../Tags';
import icon from './WebAce.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

function MangaExtractor(element: HTMLDivElement) {
    const anchor = element.querySelector<HTMLAnchorElement>('a');
    const id = anchor.pathname.match(/(\/[^/]+\/contents\/\d+\/)/)[1];
    const title = element.querySelector <HTMLHeadingElement>('h3').textContent.trim();
    return { id, title };
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webace', `webエース (web ace)`, 'https://web-ace.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        // NOTE: only mangas with ID >= 1000000 have chapters for online reading
        return new RegExp(`^${this.URI.origin}/[^/]+/contents/\\d{7}/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        //website manga list gives links like this https://web-ace.jp/sheepmagazine/contents/123456/comics/12345688/
        //we have to remove the garbage so its in the form https://web-ace.jp/sheepmagazine/contents/
        //We cant ask the user to get a matching url since the website doesnt provide them within the good format
        //we also enforce / a the end of the identifier
        const uri = new URL(url);
        uri.pathname = uri.pathname.match(/(\/[^/]+\/contents\/\d{7}\/)/)[1];
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLHeadingElement>(request, 'div#sakuhin-info div.credit h1');
        return new Manga(this, provider, uri.pathname, data[0].textContent.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        let mangaList: Manga[]= [];
        for (let page = 0, run = true; run; page += 20) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, `/schedule/${page}/`, 'div.row div.col div.box', MangaExtractor);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        // NOTE: only mangas with ID >= 1000000 have chapters for online reading
        mangaList = mangaList.filter(manga => /\d{7}\/$/.test(manga.Identifier));
        //filter duplicates (because we removed the /comics/ part we have dupes)
        return mangaList.filter((obj, index, arr) => {
            return arr.map(mapObj => mapObj.Identifier).indexOf(obj.Identifier) === index;
        });

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`${manga.Identifier}episode/`, this.URI).href;
        const request = new Request(url);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div#read ul.table-view li.media:not(.yudo) a.navigate-right');
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('div.media-body p.text-bold').textContent.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`${chapter.Identifier}json/`, this.URI).href;
        const request = new Request(url);
        const data = await FetchJSON<string[]>(request);
        return data.map(image => new Page(this, chapter, new URL(image, request.url)));
    }
}