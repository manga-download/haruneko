import { Tags } from '../Tags';
import icon from './Atsumaru.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIManga = {
    id: string;
    title: string;
    chapters?: {
        id: string;
        title: string;
    }[]
};

type APIMangas = {
    hits: {
        document: APIManga;
    }[];
};

type APIPages = {
    readChapter: {
        pages: {
            image: string;
        }[]
    }
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.content.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://atsu.moe/api/';

    public constructor() {
        super('atsumaru', 'Atsumaru', 'https://atsu.moe', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                await Delay(500);
                const { hits } = await FetchJSON<APIMangas>(new Request(new URL(`./collections/manga/documents/search?q=*&page=${page}&per_page=250`, this.URI)));
                const mangas = hits.map(({ document: { id, title} }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./manga/info?mangaId=${manga.Identifier}`, this.apiUrl)));
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { readChapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./read/chapter?mangaId=${chapter.Parent.Identifier}&chapterId=${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ image }) => new Page(this, chapter, new URL(image, this.URI)));
    }
}