import { Tags } from '../Tags';
import icon from './MangaGeko.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.main-head h1[itemprop="name"]')
@Common.PagesSinglePageCSS('section.page-in div img[onerror]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangageko', `MangaGeko`, 'https://www.mgeko.cc', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(`${this.URI.origin}/browse-comics/?results=1`);
        const [data] = await FetchCSS<HTMLSpanElement>(request, 'span.mg-pagination-last');
        const lastPageNumber = parseInt(data.textContent.match(/\d+/)[0]);
        const endpoints = new Array(lastPageNumber).fill(0).map((_, index) => index + 1).map(page => `/browse-comics/?results=${page}`);
        return Common.FetchMangasMultiPageCSS.call(this, provider, 'li.novel-item a', Common.StaticLinkGenerator(...endpoints), 0, Common.AnchorInfoExtractor(true));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`${manga.Identifier}all-chapters/`, this.URI));
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.chapter-list li a');
        return data.map(element => {
            const title = element.querySelector('strong.chapter-title').textContent;
            return new Chapter(this, manga, element.pathname, title.replace(/-([a-z]+)-li/, ' ($1)').trim());
        }).distinct();
    }
}