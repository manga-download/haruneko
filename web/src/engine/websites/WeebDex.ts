import { Tags } from '../Tags';
import icon from './WeebDex.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data?: {
        id: string;
        title: string;
        //language: 'ja';
    }[];
}

type APIChapters = {
    data?: {
        id: string;
        title: string;
        volume: string;
        chapter: string;
        language: 'en'/* | 'jp'*/;
    }[];
};

type APIPages = {
    node: string; // https://s13.notdelta.xyz
    data: {
        name: string; // https://s13.notdelta.xyz/data/ypasjpztxy/1-d479e62e2863f0ed9b4447cd63956cec3ac89d709615311c362e482494c8639a.webp
    }[];
}

@Common.MangaCSS(/^{origin}\/title\/[^/]+\/[^/]+$/, 'meta[property="og:title"]', (meta: HTMLMetaElement, uri) => ({
    id: uri.pathname.split('/').at(2),
    title: meta.content.replace('- WeebDex', '').trim(),
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #apiTaskPool = new TaskPool(1, new RateLimit(4, 1));

    public constructor() {
        super('weebdex', 'WeebDex', 'https://weebdex.org', Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator);
        this.imageTaskPool
    }

    public override get Icon() {
        return icon;
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let year = 1900; year <= new Date().getFullYear(); year++) {
                for (let page = 1, run = true; run; page++) {
                    const { data } = await this.#FetchAPI<APIMangas>('/manga', [
                        ['contentRating', 'safe'],
                        ['contentRating', 'suggestive'],
                        ['contentRating', 'erotica'],
                        ['contentRating', 'pornographic'],
                        ['sort', 'views'],
                        ['hasChapters', 'true'],
                        ['yearFrom', `${year === 1900 ? 0 : year}`],
                        ['yearTo', `${year}`],
                        ['page', `${page}`],
                        ['limit', '100'],
                    ]);
                    const mangas = !data ? [] : data.map(({ id, title }) => new Manga(this, provider, id, title));
                    mangas.length > 0 ? yield* mangas : run = false;
                }
            }
        }.call(this));
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.#FetchAPI<APIChapters>(`/manga/${manga.Identifier}/chapters`, { limit: '500', page: `${page}`});
                const chapters = !data ? [] : data.map(({ id, volume, chapter, title, language }) => {
                    title = [
                        volume ? 'Vol. ' + volume : null,
                        chapter ? 'Ch. ' + chapter : 'Oneshot',
                        title ? '- ' + title : null,
                        language ? '(' + language + ')' : null,
                    ].filter(segment => segment).join(' ');
                    return new Chapter(this, manga, id, title);
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { node, data } = await this.#FetchAPI<APIPages>('/chapter/' + chapter.Identifier);
        return data.map(({ name }) => new Page(this, chapter, new URL(`/data/${chapter.Identifier}/${name}`, node)));
    }

    async #FetchAPI<T extends JSONElement>(endpoint: string, search: string[][] | Record<string, string> = {}): Promise<T> {
        const uri = new URL(endpoint, 'https://api.weebdex.org');
        uri.search = new URLSearchParams(search).toString();
        return this.#apiTaskPool.Add<T>(() => FetchJSON<T>(new Request(uri)), Priority.Normal);
    }
}