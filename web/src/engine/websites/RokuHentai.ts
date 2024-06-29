import { Tags } from '../Tags';
import icon from './RokuHentai.webp';
import { DecoratableMangaScraper/*, Manga, type MangaPlugin*/ } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
/*import { FetchHTML, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    'manga-ids': string[],
    'manga-cards': string[],
    next: string | null
}
*/

@Common.MangaCSS(/^{origin}\/[^/]+\/\d+$/, 'h3.mdc-drawer__title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('img.site-reader__image')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rokuhentai', 'RokuHentai', 'https://rokuhentai.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
    /*
    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const dom = await FetchHTML(new Request(this.URI));
        mangaList.push(...this.ExtractMangas(dom, provider));

        let url = dom.documentElement.querySelector<HTMLDivElement>('div#site-search-spinner-next').dataset.src;

        while (url) {
            const data = await FetchJSON<APIMangas>(new Request(url));

            const fragment = new DocumentFragment();
            const dummyDiv = document.createElement('div');
            data['manga-cards'].forEach(card => dummyDiv.innerHTML += card);

            fragment.appendChild(dummyDiv);

            const mangas = this.ExtractMangas(fragment, provider);
            mangaList.push(...mangas);
            url = data.next;
        }
        return mangaList;
    }

    private ExtractMangas(dom: Document | DocumentFragment, provider: MangaPlugin): Manga[] {
        const nodes = [...(dom instanceof Document ? dom.documentElement : dom).querySelectorAll<HTMLDivElement>('div.mdc-card:not([class*="ad-slot"])')];
        return nodes.map(manga => new Manga(this, provider, manga.querySelector<HTMLAnchorElement>('a').pathname, manga.querySelector<HTMLDivElement>('div.site-manga-card__title--primary').textContent.replaceAll('\n', '').trim()));
    }
    */
}