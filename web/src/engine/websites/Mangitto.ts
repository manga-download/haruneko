import { Tags } from '../Tags';
import icon from './Mangitto.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIManga = {
    id: string;
    slug: string;
    title: string;
};

type APIMangas = {
    hits: {
        document: APIManga;
    }[];
};

type APIChapters = {
    chapters: {
        chapter: number;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^\/]+$/, 'div.w-full h1', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.trim()
}))
@Common.PagesSinglePageCSS('img[data-page-number]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangitto', 'Mangitto', 'https://mangtto.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { hits } = await FetchJSON<APIMangas>(new Request(new URL(`./manga/search?page=${page}`, this.apiURL)));
                const mangas = hits.map(({ document: { title, slug } }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run;) {
                const { chapters: chaptersData } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier}/chapters?take=50&skip=${offset}`, this.apiURL)));
                const chapters = chaptersData.map(({ chapter }) => new Chapter(this, manga, `/manga/${manga.Identifier}/${chapter}`, `Bölüm ${chapter}`));
                chapters.length > 0 ? yield* chapters : run = false;
                offset += chapters.length;
            }
        }.call(this))).reverse();
    }
}