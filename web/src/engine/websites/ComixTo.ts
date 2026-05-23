import { Tags } from '../Tags';
import icon from './ComixTo.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Page } from '../providers/MangaPlugin';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './ComixTo.DRM';

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

@Common.MangaCSS(/^{origin}\/title\/[^/]+$/, 'meta[property="og:title"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/v1/`;
    readonly #drm = new DRMProvider();

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
        const chapters = await this.#drm.GetChaptersData(new URL(manga.Identifier, this.URI));
        return chapters.map(({ id, number, name, group }) => {
            const title = [number, name && `- ${name}`, group && `[${group.name}]`].filter(Boolean).join(' ');
            return new Chapter(this, manga, `${manga.Identifier}/${id}-chapter-${number}`, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await this.#drm.CreatePageLinks(new URL(chapter.Identifier, this.URI));
        return images.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }
}