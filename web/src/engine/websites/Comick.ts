import { Tags } from '../Tags';
import icon from './Comick.webp';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIResult<T> = {
    data: T;
    next_cursor?: string;
};

type APIManga = {
    slug: string;
    title: string;
};

type APIMangas = APIResult<APIManga[]>;

type APIChapter = {
    hid: string;
    chap: string;
    title: string;
    lang: string;
    images: {
        url: string;
    }[];
    group_name: string[];
};

type APIChapters = APIResult<APIChapter[]>;

type JSONPages = {
    chapter: APIChapter;
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/comic\/[^/]+$/, 'a[href*="/cover"] img', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.alt.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://comick.live/api/';

    public constructor() {
        super('comick', 'Comick (.live)', 'https://comick.live', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, ...Tags.Rating.toArray());
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/search', this.URI)), '');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            let cursor = '';
            do {
                await Delay(500);
                const { data, next_cursor } = await FetchJSON<APIMangas>(new Request(new URL(`./search?cursor=${encodeURIComponent(cursor)}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                yield* mangas;
                cursor = next_cursor;
            } while (cursor);
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                await Delay(200);
                const { data } = await FetchJSON<APIChapters>(new Request(new URL(`./comics/${manga.Identifier}/chapter-list?page=${page}`, this.apiURL)));
                const chapters = data.map(({ chap, hid, title, lang, group_name: groups }) => new Chapter(this, manga, `/comic/${manga.Identifier}/${hid}-chapter-${chap}-${lang}`, ['Ch.', chap, title, `[${groups.join(' ').trim()}]`].joinTitleSegments()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [{ text }] = await FetchCSS<HTMLScriptElement>(new Request(new URL(chapter.Identifier, this.URI)), 'script#sv-data');
        return (<JSONPages>JSON.parse(text)).chapter.images.map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }
}