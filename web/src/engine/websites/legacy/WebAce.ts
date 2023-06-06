import { Tags } from '../../Tags';
import icon from './WebAce.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest } from '../../FetchProvider';
function MangaExtractor(element: HTMLDivElement) {
    const anchor = element.querySelector<HTMLAnchorElement>('a');
    const id = anchor.pathname.split('comics/')[0];
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
        return new RegExp(/^https?:\/\/web-ace\.jp\/\S+\/contents\/\d+\/(?!episode)/).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        //good url should be https://web-ace.jp/youngaceup/contents/1000183/
        //website manga list gives links like this https://web-ace.jp/youngaceup/contents/1000183/comics/3524/
        //we have to remove the garbage (its easier to accept both for the user)
        const uri = new URL(url);
        uri.pathname = uri.pathname.split('comics/')[0];
        const request = new FetchRequest(uri.href);
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
        mangaList = mangaList.filter(manga => /\d{7}\/?$/.test(manga.Identifier));
        //filter duplicates (because we removed the /comics/ part we have dupes)
        return mangaList.filter((obj, index, arr) => {
            return arr.map(mapObj => mapObj.Identifier).indexOf(obj.Identifier) === index;
        });

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier + 'episode/', this.URI).href;
        const request = new FetchRequest(url);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div#read ul.table-view li.media:not(.yudo) a.navigate-right');
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('div.media-body p.text-bold').textContent.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier + 'json/', this.URI).href;
        const request = new FetchRequest(url);
        const data = await FetchJSON<string[]>(request);
        return data.map(image => new Page(this, chapter, new URL(image, request.url)));
    }
}