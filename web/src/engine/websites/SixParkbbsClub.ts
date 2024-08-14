import { Tags } from '../Tags';
import icon from './SixParkbbsClub.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

export async function FetchMangas(this: DecoratableMangaScraper, provider: MangaPlugin, path: string, search: string, queryMain: string, queryMangas: string, querySearch: string): Promise<Manga[]> {
    const mangaList : Manga [] = [];
    for(let page = 1, run = true; run; page++) {
        const uri = new URL(path + search, this.URI);
        const main = (await FetchCSS(new Request(uri), queryMain))?.at(0);
        const entries = [...main.querySelectorAll<HTMLAnchorElement>(queryMangas)];
        const mangas = entries
            //.filter(entry => /* entry.innerText.trim() */)
            .map(element => {
                const title = element.innerText.replace(/^\s*[[【].+?[\]】]/, '').trim();
                return new Manga(this, provider, path + element.search, title);
            });
        mangaList.push(...mangas);
        search = main.querySelector<HTMLAnchorElement>(querySearch)?.search ?? uri.search;
        run = entries.length > 0 && uri.search !== search;
    }
    return mangaList.distinct();
}

export function PageExtract(element: HTMLImageElement) {
    return element.getAttribute('mydatasrc') || element.getAttribute('src');
}

@Common.MangaCSS(/^{origin}\/enter6\/index\.php\?app=forum&act=threadview&tid=\d+/, 'td.show_content font b', undefined, true)
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('td.show_content pre img', PageExtract)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sixparkbbsclub', '6parkbbs Club (新❀华漫)', 'https://club.6parkbbs.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return FetchMangas.call(
            this, provider, '/enter6/index.php', '?app=forum&act=list',
            'div#main div#main_right',
            'div#d_list > ul > li > a:nth-child(1)',
            'div#d_list_page a:last-of-type');
    }
}