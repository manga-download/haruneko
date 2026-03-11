import { Tags } from '../Tags';
import icon from './AstraToons.webp';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, type Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    id: number;
    title: string;
    slug: string;
};

type APIMangas = {
    data: APIManga[];
};

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'body', body => ({
    id: body.querySelector('main[x-data]').getAttribute('x-data').match(/\d+/).at(0),
    title: body.querySelector<HTMLImageElement>('img.object-cover').alt.trim()
}))
@Common.PagesSinglePageCSS('div#reader-container img')
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://new.astratoons.com/api/';

    public constructor() {
        super('astratoons', 'AstraToons', 'https://new.astratoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run && page < 1000; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./comics?page=${page}`, this.apiUrl)));
                const mangas = data.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run && page < 1000; page++) {
                const { html } = await FetchJSON<{ html: string }>(new Request(new URL(`./comics/${manga.Identifier}/chapters?page=${page}`, this.apiUrl)));
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const chapters = [...doc.querySelectorAll<HTMLAnchorElement>('a')].map(anchor => {
                    return new Chapter(this, manga, anchor.pathname, anchor.querySelector<HTMLSpanElement>('span.text-white').textContent.trim());
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(page.Link, {
                headers: {
                    Referer: new URL(page.Parent.Identifier, this.URI).href,
                    'Sec-Fetch-Site': 'same-origin'
                },
            }))).blob();
        }, priority, signal);
    }
}