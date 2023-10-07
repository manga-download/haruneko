import { Tags } from '../../Tags';
import icon from './ShonenMagazine.webp';
import { DecoratableMangaScraper, type Manga, /*type MangaPlugin*/ } from '../../providers/MangaPlugin';
import * as CoreView from '../decorators/CoreView';
//import { FetchCSS, FetchRequest } from '../../FetchProvider';

function MangaExtractor(element: HTMLElement, queryURI: string, queryTitle: string) {
    const id = (element.querySelector<HTMLAnchorElement>(queryURI) || element as HTMLAnchorElement).href;//HREF NOT PATHNAME
    const title = (element.querySelector<HTMLElement>(queryTitle) || element).textContent.trim();
    return { id, title };
}
function ChapterExtractor(element: HTMLElement, manga: Manga) {
    const title = element.querySelector('title').textContent.replace(manga.Title, '').trim() || manga.Title;
    const id = new URL(element.querySelector<HTMLLinkElement>('link').href, this.URI).href; //HREF NOT PATHNAME
    return { id, title };
}

@CoreView.MangasMultiPageCSS(['/series/smaga', '/series/bmaga', '/series/others'], 'article.serial-series-contents ul.serial-series-list > li.serial-series-item > a', undefined, CoreView.queryMangaTitle, MangaExtractor)
@CoreView.ChaptersSinglePageCSS(CoreView.queryChapters, ChapterExtractor)
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenmagazine', `週刊少年マガジ (Weekly Shonen Magazine)`, 'https://shonenmagazine.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }
    public override get Icon() {
        return icon;
    }

    /*
    // NO CLIPBOARD SUPPORT: ALL URLS WILL BE HANDLED BY PLUGIN POCKET SHONENMAGAZINE
    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/(\S*\.)?shonenmagazine\.com\/episode\/\d+$/.test(url);
    }
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const request = new FetchRequest(url);
        const data = await FetchCSS<HTMLHeadingElement>(request, CoreView.queryMangaTitleFromURI);
        return new Manga(this, provider, url, data[0].textContent.trim());
    }
    */
}