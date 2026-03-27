import { Tags } from '../Tags';
import icon from './ComixTo.webp';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    result: {
        items: T;
    };
};

type APIMangas = APIResult<APIManga[]>;

type APIManga = {
    hash_id: string;
    title: string;
    slug: string;
};

type APIChapters = APIResult<APIChapter[]>;

type APIChapter = {
    chapter_id: number;
    number: number;
    name: string;
};

type HydratedImages = {
    images: {
        url: string;
    }[]
};

@Common.MangaCSS(/^{origin}\/title\/[^/]+$/, 'section.comic-info h1.title')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/v2/`;

    public constructor() {
        super('comixto', 'Comix (.to)', 'https://comix.to', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { result: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?limit=100&page=${page}`, this.apiUrl)));
                const mangas = items.map(({ hash_id: hash, title, slug }) => new Manga(this, provider, `/title/${hash}-${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const hash = manga.Identifier.match(/\/title\/([^/-]+)-/).at(1);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { result: { items } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${hash}/chapters?limit=100&page=${page}&order[number]=desc`, this.apiUrl)));
                const chapters = items.map(({ chapter_id: id, number, name }) => new Chapter(this, manga, `${manga.Identifier}/${id}-chapter-${number}`, [number, name ? `- ${name}` : ''].join(' ').trim()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedImages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        return images.map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }
}