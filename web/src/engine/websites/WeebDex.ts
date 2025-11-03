import { Tags } from '../Tags';
import icon from './WeebDex.webp';
import { FetchJSON } from '../platform/FetchProvider';
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

    readonly #apiURL = 'https://api.weebdex.org';

    public constructor() {
        super('weebdex', 'WeebDex', 'https://weebdex.org', Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return Array.fromAsync(async function* () {
            for (let page = 1, run = true; run; page++) {
                const uri = new URL(`/manga?sort=title&order=asc&hasChapters=true&limit=98&page=${page}`, this.#apiURL);
                const { data } = await FetchJSON<APIMangas>(new Request(uri));
                const mangas = !data ? [] : data.map(({ id, title }) => {
                    return new Manga(this, provider, id, title);
                });
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return Array.fromAsync(async function* () {
            for (let page = 1, run = true; run; page++) {
                const uri = new URL(`/manga/${manga.Identifier}/chapters?limit=250&page=${page}`, this.#apiURL);
                const { data } = await FetchJSON<APIChapters>(new Request(uri));
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
        const uri = new URL('/chapter/' + chapter.Identifier, this.#apiURL);
        const { node, data } = await FetchJSON<APIPages>(new Request(uri));
        return data.map(({ name }) => new Page(this, chapter, new URL(`/data/${chapter.Identifier}/${name}`, node)));
    }
}