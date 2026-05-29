import { Tags } from '../Tags';
import icon from './ColorcitoScans.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    name: string;
    slug: string;
    chapters: APIChapter[];
}

type APIChapter = {
    num: number;
    slug: string;
    pageches: {
        urlImg: string;
    };
};

type APIMangaDetails = {
    serie: APIManga;
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/ver\/[^/]+$/, 'meta[property="og:title"]', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.content.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.colorcitoscan.com/';

    public constructor() {
        super('colorcitoscans', 'Colorcito Scans', 'https://colorcitoscan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./filtrar?page=${page}&limit=50&loading=true`, this.apiUrl)));
                const mangas = data.map(({ slug, name }) => new Manga(this, provider, slug, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { serie: { chapters } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./serie/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(({ num, slug }) => new Chapter(this, manga, slug, `${num}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pageches: { urlImg } } = await FetchJSON<APIChapter>(new Request(new URL(`./serie/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl)));
        return (JSON.parse(urlImg) as string[]).map(image => new Page(this, chapter, new URL(image)));
    }
}