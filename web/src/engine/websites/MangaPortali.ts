import { Tags } from '../Tags';
import icon from './MangaPortali.webp';
import { FetchCSS } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'h1')
@Common.PagesSinglePageCSS('img[alt^="Sayfa"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaportali', 'Manga Portalı', 'https://www.mangaportali.com', Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    // NOTE: no url-based pagination scheme could be found for `/series`, this only
    // covers the single server-rendered page (there may be more behind client-side
    // infinite scroll or an API call that wasn't identified)
    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/series', this.URI));
        const data = await FetchCSS<HTMLImageElement>(request, 'a[href^="/series/"] img[alt]');
        return data.map(image => {
            const id = image.closest('a').getAttribute('href');
            const title = image.alt.replace(/\s*kapak görseli\s*$/i, '').trim();
            return new Manga(this, provider, id, title);
        });
    }

    // NOTE: the manga page also has "first chapter" / "latest chapter" shortcut buttons
    // that link to the same URLs as two entries in the real chapter list below them;
    // reverse first so the real, properly titled entries are seen before their
    // shortcut duplicates, then drop the duplicates
    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI));
        const data = await FetchCSS<HTMLAnchorElement>(request, 'a[href*="/reader/"]');
        const seen = new Set<string>();
        const chapters: Chapter[] = [];
        for (const anchor of data.slice().reverse()) {
            const id = anchor.getAttribute('href');
            if (seen.has(id)) {
                continue;
            }
            seen.add(id);
            const title = (anchor.querySelector('p') || anchor).textContent.trim();
            chapters.push(new Chapter(this, manga, id, title));
        }
        return chapters;
    }
}
