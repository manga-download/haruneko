import { Tags } from '../Tags';
import icon from './MangaGecko.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.main-head h1[itemprop="name"]')
@Common.PagesSinglePageCSS('section.page-in div img[onerror]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagecko', `MangaGecko`, 'https://www.mgeko.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {

        const request = new Request(`${this.URI.origin}/browse-comics/?results=1`);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.pagination li:not([class]) a');
        const pageMax = parseInt(data[0].text.trim());
        const mangaList: Manga[] = [];

        for (let page = 1; page <= pageMax; page++) {
            await new Promise(resolve => setTimeout(resolve, 250));
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, `/browse-comics/?results=${page}`, 'li.novel-item a', Common.AnchorInfoExtractor(true));
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`${manga.Identifier}all-chapters/`, this.URI).href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.chapter-list li a');
        return data.map(element => {
            const title = element.querySelector('strong.chapter-title').textContent;
            return new Chapter(this, manga, element.pathname, title.replace(/-([a-z]+)-li/, ' ($1)').trim());
        }).distinct();
    }

}