import { Exception } from '../../Error';
import { FetchJSON } from '../../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from '../decorators/Common';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';

// TODO: Add Novel support

type APIManga = {
    title: string;
    id: number;
    series_type: string;
    series_slug: string;
};

type APIResult<T> = {
    data: T;
};

type APIChapter = {
    index: string;
    id: number;
    chapter_name: string;
    chapter_title: string;
    chapter_slug: string;
};

type APIPages = {
    chapter_type: string;
    paywall: boolean;
    data: string[] | string;
    chapter: {
        chapter_type: string;
        storage: string;
        chapter_data?: {
            images?: string[];
            files: {
                url: string;
            }[];
        }
    }
};

type APIMediaID = {
    id: string;
    slug: string;
};

type PageType = {
    type: string;
};

export class HeanCMS extends DecoratableMangaScraper {

    protected apiUrl = this.URI.origin.replace('://', '://api.');
    protected mediaUrl = this.apiUrl;

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title, series_slug, id } = await this.FetchAPI<APIManga>(`./series/${url.split('/').at(-1)}`);
        return new Manga(this, provider, JSON.stringify({ id: id.toString(), slug: series_slug }), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (const adult of [true, false]) { //adult flag mean ONLY adult, false mean ONLY all ages... Talk about stupid. Old api ignore that flag
                for (let page = 1, run = true; run; page++) {
                    const { data } = await this.FetchAPI<APIResult<APIManga[]>>(`./query?perPage=100&page=${page}&adult=${adult}`);
                    const mangas = !data.length ? [] : data.map(({ id, series_slug: slug, title }) => new Manga(this, provider, JSON.stringify({ id: `${id}`, slug }), title));
                    mangas.length > 0 ? yield* mangas : run = false;
                }
            }
        }.call(this))).distinct();//filter in case of old api
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id: mangaId }: APIMediaID = JSON.parse(manga.Identifier);
        const { data } = await this.FetchAPI<APIResult<APIChapter[]>>(`./chapter/query?series_id=${mangaId}&perPage=9999&page=1`);
        return data.map(({ id, chapter_name: name, chapter_slug: slug, chapter_title: title }) => new Chapter(this, manga, JSON.stringify({
            id: `${id}`,
            slug,
        }), `${name} ${title || ''}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageType>[]> {
        const { slug: chapterSlug }: APIMediaID = JSON.parse(chapter.Identifier);
        const { slug: mangaSlug }: APIMediaID = JSON.parse(chapter.Parent.Identifier);
        const { data, paywall, chapter: { chapter_type, chapter_data, storage } } = await this.FetchAPI<APIPages>(`./chapter/${mangaSlug}/${chapterSlug}`);

        if (paywall) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }

        if (chapter_type.toLowerCase() === 'novel') {
            throw new Exception(R.Plugin_HeanCMS_ErrorNovelsNotSupported);
        }
        //old API vs new
        const listImages = Array.isArray(data) ? data as string[] : chapter_data.images ? chapter_data.images : chapter_data.files.map(file => file.url);
        return listImages.map(image => new Page<PageType>(this, chapter, this.ComputePageUrl(image, storage), { type: chapter_type }));
    }

    protected ComputePageUrl(image: string, storage: string): URL {
        if (new RegExpSafe(/^http(s)?:\/\//).test(image)) return new URL(image);
        switch (storage) {
            case "s3": return new URL(image);
            case "local": return new URL(`${this.mediaUrl}/${image}`);
        }
    }

    public override async FetchImage(page: Page<PageType>, priority: Priority, signal: AbortSignal, detectMimeType = true, deProxifyLink = true): Promise<Blob> {
        if (page.Parameters?.type === 'Comic') {
            return Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType, deProxifyLink);
        } else throw new Exception(R.Plugin_HeanCMS_ErrorNovelsNotSupported);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                Referer: this.URI.href
            }
        }));
    }
}
