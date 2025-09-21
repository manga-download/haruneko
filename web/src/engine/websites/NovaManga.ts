import { Tags } from '../Tags';
import icon from './NovaManga.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLParagraphElement>('p').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'title', (element: HTMLTitleElement) => element.textContent.split('|').at(0).trim())
@Common.ChaptersSinglePageCSS('div.grid a.recentCardItem', undefined, ChapterExtractor)
@Common.PagesSinglePageCSS('div.content img[data-src]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novamanga', 'Nova Manga', 'https://novamanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const links = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`./search?page=${page}`, this.URI), {
            method: 'POST'
        }), 'div.grid a[href*="/series/"]');
        return links.map(item => new Manga(this, provider, item.pathname, item.querySelector<HTMLParagraphElement>('div div p').textContent.trim()));
    }
}