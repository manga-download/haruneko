import { Tags } from '../Tags';
import icon from './Kagane.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

import { DRMProvider, type PageParameters } from './Kagane.DRM';

type APIChapters = {
    content: {
        id: string;
        title: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/series\/[0-9A-Z]+(#[^/]*)?$/, 'head > title', (title, uri) => ({ id: uri.pathname.split('/').at(-1), title: title.innerText.trim() }))
@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();
    readonly #apiURL = 'https://api.kagane.org/api/v1/';

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
        const uri = new URL(`./books/${manga.Identifier}`, this.#apiURL);
        const { content } = await FetchJSON<APIChapters>(new Request(uri));
        return content.map(({id, title}) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const uri = new URL(`./books/${chapter.Parent.Identifier}/file/${chapter.Identifier}`, this.#apiURL);
        const pages = await this.#drm.CreateImageLinks(uri, chapter.Parent.Identifier, chapter.Identifier);
        return pages.map(({ link, parameters })=> new Page<PageParameters>(this, chapter, link, parameters));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const bytes = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { signal: signal }));
            return response.arrayBuffer();
        }, priority, signal);

        return this.#drm.DecryptImage(bytes, page.Parameters);
    }
}