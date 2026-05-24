import { Tags } from '../Tags';
import icon from './Kagane.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

import { DRMProvider, type PageParameters } from './Kagane.DRM';

type APIChapters = {
    series_books: {
        book_id: string;
        title: string;
        //chapter_no: string;
        //groups: { title: string; }[];
    }[];
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/series\/[-a-z0-9A]+(#[^/]+)?$/, 'meta[property="og:title"]', (meta, uri) => ({ id: uri.pathname.split('/').at(-1), title: meta.content.trim() }))
@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();
    //readonly #apiURL = 'https://akari.kagane.org/api/v2/';
    readonly #apiURL = 'https://yuzuki.kagane.org/api/v2/';

    public constructor() {
        super('kagane', 'Kagane', 'https://kagane.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, ...Tags.Rating.toArray());
    }

    public override get Icon() {
        return icon;
    }

    /* ⚠️ Disabled for now due to high risk of IP ban (429 => Too many Requests)
    // TODO: Consider adding this to the website list provider repository
    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type APIMangas = {
            content: {
                id: string;
                name: string;
            }[];
        };
        const uri = new URL(`./search`, this.#apiURL);
        uri.search = new URLSearchParams({ size: '100', sort: 'name', scanlations: 'true' }).toString();
        return Array.fromAsync(async function* () {
            for (let page = 0, run = true; run; page++) {
                uri.searchParams.set('page', `${page}`);
                const { content } = await FetchJSON<APIMangas>(new Request(uri, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sources: [], content_rating: ['safe', 'suggestive', 'erotica', 'pornographic']}),
                }));
                const mangas = content.map(({ id, name }) => new Manga(this, provider, id, name));
                mangas.length > 0 ? yield* mangas : run = false;
                await Delay(2500);
            }
        }.call(this));
    }*/

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`./series/${manga.Identifier}`, this.#apiURL);
        const { series_books: chapters } = await FetchJSON<APIChapters>(new Request(uri));
        return chapters.map(({ book_id: id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const uri = new URL(`./books/${chapter.Identifier}?is_datasaver=false`, this.#apiURL);
        const pages = await this.#drm.CreateImageLinks(uri, chapter.Parent.Identifier, chapter.Identifier);
        return pages.map(({ link, parameters })=> new Page<PageParameters>(this, chapter, link, parameters));
    }
}