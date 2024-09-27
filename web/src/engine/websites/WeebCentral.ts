import { Tags } from '../Tags';
import icon from './WeebCentral.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/[^/]+$/, 'section > section > h1.text-center')
@Common.PagesSinglePageCSS('main section img[alt*="Page"]:not([x-show]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('weebcentral', 'WeebCentral', 'https://weebcentral.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList : Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const mangasperPage = 24;
        const searchURL = new URL('/search', this.URI).href;
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/search?limit=${mangasperPage}&offset=${page * mangasperPage}`, this.URI), {
            headers: {
                'HX-Request': 'true',
                'HX-Current-URL': searchURL,
                'HX-Target': 'search-more-container',
                Referer: searchURL

            }
        }), 'a.link.link-hover[href*="/series/"]');
        return data.map(manga => new Manga(this, provider, manga.pathname, manga.textContent.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const serieId = manga.Identifier.match(/(\/series\/[^/]+)\//)[1];
        const chapterUrl = new URL(manga.Identifier, this.URI).href;
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${serieId}/full-chapter-list`, this.URI), {
            headers: {
                'HX-Request': 'true',
                'HX-Current-URL': chapterUrl,
                'HX-Target': 'chapter-list',
                Referer: chapterUrl
            }
        }), 'a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.querySelector('span.grow span').textContent.trim()));
    }

}