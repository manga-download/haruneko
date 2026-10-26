import { Tags } from '../Tags';
import icon from './Kagane.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type CachedMangas = {
    id: string;
    title: string;
}[];

type PackedChapters = {
	fields: string[];
	books: (string | number)[][];
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

@Common.MangaCSS<HTMLMetaElement>(/^https:\/\/kagane\.(cx|moe|net)\/series\/[^/]+(-[a-fA-F0-9]{4,12}){5}([#?]|$)/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname.split('-').slice(-5).join('-'),
    title: meta.content.trim(),
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #apiURL = `${this.URI.origin}/api/v2/`;

    public constructor() {
        super('kagane', 'Kagane', 'https://kagane.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, ...Tags.Rating.toArray());
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaCache = await FetchJSON<CachedMangas>(new Request(`https://websites.hakuneko.download/${this.Identifier}.json`));
        return mangaCache.map(({ id, title }) => new Manga(this, provider, id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { fields, books } = await FetchJSON<PackedChapters>(new Request(new URL(`./series/${manga.Identifier}/books/index?fields=List`, this.#apiURL)));
        return books
            .map(book => {
                const title = [`Ch. ${book[fields.indexOf('chapter_no')]}`, book[fields.indexOf('title')]].joinTitleSegments();
                return new Chapter(this, manga, book[fields.indexOf('book_id')].toString(), title);
            })
            .sort((self, other) => other.Title.localeCompare(self.Title, undefined, { numeric: true }));
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
}