import { Tags } from '../Tags';
import icon from './ZeroScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number;
    name: string;
    slug: string;
};

type APIResult<T> = {
    success: boolean;
    data: T;
    message: string;
};

type APIMangas = {
    comics: APIManga[];
};

type APIChapters = {
    data: APIChapter[];
};

type APIPages = {
    chapter: APIChapter;
};

type APIChapter = {
    id: number;
    name: number;
    high_quality: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zeroscans', `ZeroScans`, 'https://zscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.match(/\/comics\/([^/]+)$/)[1];
        const { data: { id, name } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./swordflake/comic/${slug}`, this.URI)));
        return new Manga(this, provider, JSON.stringify({ id, slug }), name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { success, data: { comics } } = await FetchJSON<APIResult<APIMangas>>(new Request(new URL('./swordflake/comics', this.URI)));
        return success ? comics.map(({ id, name, slug }) => new Manga(this, provider, JSON.stringify({ id, slug }), name.trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangainfos: APIManga = JSON.parse(manga.Identifier);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                const { success, data: { data } } = await FetchJSON<APIResult<APIChapters>>(new Request(new URL(`./swordflake/comic/${mangainfos.id}/chapters?page${page}&sort=desc`, this.URI)));
                const chapters = success ? data.map(({ id, name }) => new Chapter(this, manga, `${id}`, `Chapter ${name}`)) : [];
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangainfos: APIManga = JSON.parse(chapter.Parent.Identifier);
        const { success, data: { chapter: { high_quality } } } = await FetchJSON<APIResult<APIPages>>(new Request(new URL(`./swordflake/comic/${mangainfos.slug}/chapters/${chapter.Identifier}`, this.URI)));
        return success ? high_quality.map(page => new Page(this, chapter, new URL(page))) : [];
    }
}