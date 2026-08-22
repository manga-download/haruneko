import { Tags } from '../Tags';
import icon from './ColorcitoScans.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    response: T;
};

type APIManga = {
    name: string;
    slug: string;
};

type APIChapters = {
    lastChapters: {
        num: string;
        slug: string;
    }[];
};

type APIPages = {
    pages: {
        urlImg: string;
    };
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/ver\/[^/]+$/, 'meta[property="og:title"]', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.content.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL: string;

    public constructor(...args: [] | ConstructorParameters<typeof DecoratableMangaScraper>) {
        if (args.length) {
            super(...args as ConstructorParameters<typeof DecoratableMangaScraper>);
        } else {
            super('colorcitoscans', 'Colorcito Scans', 'https://coloresito.site', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator, Tags.Rating.Pornographic);
        }
        this.apiURL = `${this.URI.origin}/api/`;
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { response } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./searchProject`, this.apiURL)));
        return response.map(({ name, slug }) => new Manga(this, provider, slug, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { response: { lastChapters } } = await FetchJSON<APIResult<APIChapters>>(new Request(new URL(`./showProject/${manga.Identifier}`, this.apiURL)));
        return lastChapters.map(({ slug, num }) => new Chapter(this, manga, slug, `Cap. ${num}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { response: { pages: { urlImg } } } = await FetchJSON<APIResult<APIPages>>(new Request(new URL(`./showProject/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiURL)));
        return (<string[]>JSON.parse(urlImg)).map(url => new Page(this, chapter, new URL(url)));
    }
}