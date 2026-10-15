import { Tags } from '../Tags';
import icon from './Kagane.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type CachedMangas = {
    id: string;
    title: string;
}[];

type PackedChapters<T = string | number | boolean | number[]> = {
    fields: string[];
    books: T[][];
};

type APIChapter = {
    book_id: string;
    title: string;
    chapter_no: number;
    sort_no: number;
};

type APIPages = {
    cache_url: string;
    access_token: string;
    manifest: {
        pages: {
            page_id: string;
            ext: string;
        }[];
    };
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/series\/([-a-z0-9]+)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(#[^/]+)?$/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i).at(0),
    title: meta.content.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #apiURL = `${this.URI.origin}/api/v2/`;

    public constructor() {
        super('kagane', 'Kagane', 'https://kagane.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, ...Tags.Rating.toArray());
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaCache = await FetchJSON<CachedMangas>(new Request(`https://websites.hakuneko.download/${this.Identifier}.json`));
        return mangaCache.map(({ id, title }) => new Manga(this, provider, id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchJSON<PackedChapters>(new Request(new URL(`./series/${manga.Identifier}/books/index?fields=List`, this.#apiURL)));
        const chapters = this.UnpackChapters(data);
        //some mangas miss number in title (i.e Martial Peak), its better to always include it
        return chapters
            .sort((self, other) => other.sort_no - self.sort_no)
            .map(({ book_id: id, title, chapter_no: number }) => new Chapter(this, manga, id, [`Ch. ${number}`, title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`./books/${chapter.Identifier}?is_datasaver=false`, this.#apiURL);
        const { token } = await FetchJSON<{ token: string }>(new Request(new URL('/api/integrity', this.URI), { method: 'POST' }));
        const { cache_url, access_token, manifest: { pages } } = await FetchJSON<APIPages>(new Request(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Integrity-Token': token,
            },
            body: '{}',
        }));

        return pages.map(({ page_id: id, ext }) => {
            const uri = new URL(`/api/v2/books/page/${chapter.Identifier}/${id}.${ext}`, cache_url);
            uri.searchParams.set('is_datasaver', 'false');
            uri.searchParams.set('token', access_token);
            return new Page(this, chapter, uri);
        });
    }

    private UnpackChapters(packedChapters: PackedChapters): APIChapter[] {
        const chaptersObjects: APIChapter[] = [];
        const { fields, books } = packedChapters;

        for (const book of books) {
            const chapter = {};
            for (let index = 0; index <= book.length; index++) {
                chapter[fields[index]] = book[index];
            }
            chaptersObjects.push(chapter as APIChapter);
        }
        return chaptersObjects;
    }

}