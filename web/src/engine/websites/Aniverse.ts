import { Tags } from '../Tags';
import icon from './Aniverse.webp';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Page, DecoratableMangaScraper, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    items: APIManga[];
};

type APIManga = {
    slug: string;
    title: string;
};

type HydratedChapter = {
    id: string;
    number: string;
};

type HydratedPages = {
    pages: {
        src: string;
    }[];
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/[^/]+$/, 'img.object-cover.bg-secondary', (img, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: img.alt.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('aniverse', 'Aniverse', 'https://aniverse.fr', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?page=${page}`, this.apiURL)));
                const mangas = items.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchNextJS<HydratedChapter[]>(new Request(new URL(`./manga/${manga.Identifier}`, this.URI)),
            data => Array.isArray(data) && data.length > 0
                && typeof (data[0] as any).updatedAt !== 'undefined'
                && typeof (data[0] as any).number !== 'undefined'
                && typeof (data[0] as any).title !== 'undefined'
        );
        return chapters
            .sort((self, other) => parseFloat(other.number) - parseFloat(self.number))
            .map(({ id, number }) => new Chapter(this, manga, id, ['Chapitre', number].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchNextJS<HydratedPages>(new Request(new URL(`./read/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), data => 'pages' in data);
        return pages.map(({ src }) => new Page(this, chapter, new URL(src, this.URI)));
    }
}