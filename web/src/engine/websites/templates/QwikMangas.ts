/* Indonesian template : for websites using q-data.json and qwik/json requests */

import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';

type WebsiteConfig = {
    mangaKey?: string;
    pagesKey?: string;
    mangaListFunc?: string;
    mangaListEndpoint?: string;
};

type QPayload = {
	_entry: string;
	_objs: any[];
};

type HydratedManga = {
	slug: string;
	title: string;
	type: string;
	chapters: HydraTedChapter[];
};

type HydraTedChapter = {
	id: number;
	chapter: number;
	images: {
		[index: number]: { src: string }
	}
};

type HydratedPages = {
	data: HydratedManga;
};

type Loaders<T> = {
	loaders: {
		[key: string]: T;
	};
};

class QuickHydrator {

    private readonly objs: any[];
    private readonly entry: string;

    constructor(payload: QPayload) {
        const { _objs, _entry } = payload;
        this.objs = _objs;
        this.entry = _entry;
    };

    public Hydrate<T extends JSONElement>(): T {
        for (const value of this.objs) this.#FillValue(value);
        return this.#GetObjValue(this.entry) as T;
    }

    #FillValue(value: any): void {
        if (value && typeof value == 'object') {
            if (Array.isArray(value)) for (let r = 0; r < value.length; r++) value[r] = this.#GetObjValue(value[r]);
            else if (this.#IsObject(value)) for (const r in value) value[r] = this.#GetObjValue(value[r]);
        }
    }

    #ParseId(id: string): number {
        return parseInt(id, 36);
    }

    #GetObjValue(id: string): any {
        return this.objs[this.#ParseId(id)];
    }

    #IsObject(e: any): boolean {
        const t = Object.getPrototypeOf(e);
        return t === Object.prototype || t === null;
    };
}

@Common.ImageAjax()
export class QwikMangas extends DecoratableMangaScraper {

    private siteConfig: WebsiteConfig = {
        mangaKey: 'elD1mwE41aQ',
        pagesKey: 'ir0s0s187Jw',
        mangaListFunc: 'n2prqqfTjPQ',
        mangaListEndpoint: '/comic-list/'
    };

    public SetConfig(config: WebsiteConfig) {
        Object.entries(config).forEach(([key, value]) => this.siteConfig[key] = value);
        return this;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `cookieStore.set('mode', 'adult')`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(man(hu|hw|g)a|doujinshi)/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { loaders } = await this.FetchQwick<Loaders<HydratedManga>>(`${new URL(url).pathname}q-data.json`);
        const { slug, title, type } = loaders[this.siteConfig.mangaKey];
        return new Manga(this, provider, `/${this.GetSerieType(type)}/${slug}/`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
		type This = typeof this;
		return Array.fromAsync(async function* (this: This) {
		    for (let page = 1, run = true; run; page++) {
		        const data = await this.FetchQwick<HydratedManga[]>(this.siteConfig.mangaListEndpoint, this.siteConfig.mangaListFunc, {
		            _entry: '2',
		            _objs: [undefined, page, ['0', '1']]
		        });
		        const mangas = data
		            .filter(({ slug }) => slug)
		            .map(({ slug, title, type }) => new Manga(this, provider, `/${this.GetSerieType(type)}/${slug}/`, title));
		        mangas.length > 0 ? yield* mangas : run = false;
		    }
		}.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { loaders } = await this.FetchQwick<Loaders<HydratedManga>>(`${manga.Identifier}q-data.json`);
        const { chapters } = loaders[this.siteConfig.mangaKey];
        return chapters.map(({ chapter }) => new Chapter(this, manga, `${manga.Identifier}chapter-${chapter}/`, `Chapter ${chapter}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { loaders } = await this.FetchQwick<Loaders<HydratedPages>>(`${chapter.Identifier}q-data.json`);
        const { images } = loaders[this.siteConfig.pagesKey].data.chapters.at(0);
        return Object.values(images).map(({ src }) => new Page(this, chapter, new URL(src)));
    }

    private GetSerieType(type: string): string {
        return ['manga', 'manhua', 'manhwa'].includes(type.toLowerCase()) ? type.toLowerCase() : 'manhwa';
    }

    private async FetchQwick<T extends JSONElement>(endpoint: string, qfunc: string = undefined, payload: QPayload = undefined): Promise<T> {
        const url = new URL(endpoint, this.URI);
        if (qfunc) {
            url.searchParams.set('qfunc', qfunc);
            if (payload) payload._objs[0] = `\u0002_#s_${qfunc}`;
        }

        const data = await FetchJSON<QPayload>(new Request(url, {
            method: payload ? 'POST' : 'GET',
            body: payload ? JSON.stringify(payload) : undefined,
            headers: {
                ...qfunc && { 'Content-Type': 'application/qwik-json', 'X-QRL': qfunc },
            }
        }));
        return new QuickHydrator(data).Hydrate<T>();
    }
}