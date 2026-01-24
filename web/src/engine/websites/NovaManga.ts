import { Tags } from '../Tags';
import icon from './NovaManga.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS<HTMLTitleElement>(/^{origin}\/series\/[^/]+$/, 'title', (title, uri) => ({ id: uri.pathname, title: title.innerText.split('|').at(0).trim() }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.grid a.recentCardItem', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLParagraphElement>('p').textContent.trim() }))
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
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run ; page++) {
                const links = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`./search?page=${page}`, this.URI), {
                    method: 'POST'
                }), 'div.grid a[href*="/series/"]');
                const mangas = links.map(item => new Manga(this, provider, item.pathname, item.querySelector<HTMLParagraphElement>('div div p').textContent.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
}