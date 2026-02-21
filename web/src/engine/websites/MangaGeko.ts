import { Tags } from '../Tags';
import icon from './MangaGeko.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    results_html: string;
    num_pages: number;
}

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
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { results_html, num_pages } = await FetchJSON<APIMangas>(new Request(new URL(`./browse-comics/data/?results=1&page=${page}`, this.URI)));
                const elements = [...new DOMParser().parseFromString(results_html, 'text/html').querySelectorAll<HTMLAnchorElement>('h3.comic-card__title a')];
                const mangas = elements.map(anchor => new Manga(this, provider, anchor.pathname, anchor.text.trim()));
                yield* mangas;
                run = page <= num_pages;
            }
        }.call(this));
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