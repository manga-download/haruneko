import { Tags } from '../Tags';
import icon from './MangaNight.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIManga = {
    id: number;
    slug: string;
    title: {
        english: string;
    };
};

type APIPages = {
    pages: {
        url: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.tracking-tight', (el, uri) => ({
    id: uri.pathname,
    title: el.textContent.trim()
}))
@Common.ChaptersSinglePageJS(`
    [...document.querySelectorAll('div[data-slot="scroll-area"] a[href*="/capitulo/"]')].map(anchor => {
        const titleElement = anchor.querySelector('p.truncate');
        let bloat = titleElement.querySelector('span');
        while ( bloat ) {
            titleElement.removeChild(bloat);
            bloat = titleElement.querySelector('span');
        }
        return { id: anchor.pathname.split('/').at(-1), title: titleElement.textContent.trim()};
    });
`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('manganight', 'Manga Night', 'https://manganight.com.br', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { media } = await FetchJSON<{ media: APIManga[]; }>(new Request(new URL(`./catalog/search?page=${page}&perPage=50`, this.apiURL)));
                const mangas = media.map(({ slug, title: { english } }) => new Manga(this, provider, `/manga/${slug}`, english));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./reader/pages?chapterId=${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}