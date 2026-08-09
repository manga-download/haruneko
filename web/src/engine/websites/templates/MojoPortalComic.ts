// Seems to be based on MangaReader or MangaStream

import * as Common from '../decorators/Common';
import { type MangaScraper, type MangaPlugin, type Manga, Chapter } from "../../providers/MangaPlugin";
import { FetchJSON } from '../../platform/FetchProvider';

export const queryManga = 'article#item-detail h1.title-detail';
export const MangasLinkGenerator = Common.PatternLinkGenerator<MangaPlugin>('/?page={page}');
export const queryMangas = 'div.items div.item figcaption h3 a.jtip';
export const queryChapters = 'ul li div.chapter a[data-id]';
export const queryPages = 'div.page-chapter > img';

type APIChapters = {
    data: {
        chapter_id: number;
        chapter_name: string;
        chapter_slug: string;
    }[]
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to {@link this} scraper's base url
 * @param useComicId - Extract comicId from slug for the api call. Otherwise only uses slug.
 */
export async function FetchChaptersSinglePageAJAX(this: MangaScraper, manga: Manga, useComicId: boolean = false): Promise<Chapter[]> {
    const baseSlug = manga.Identifier.split('/').filter(Boolean).at(-1); //take care of eventual trailing '/'
    const [, requestSlug, mangaId] = useComicId
        ? manga.Identifier.match(/\/[^\/]+\/(.+)-(\d+)(\/)?$/)
        : [undefined, baseSlug, undefined];

    const { data } = await FetchJSON<APIChapters>(new Request(new URL(`/Comic/Services/ComicService.asmx/ChapterList?slug=${requestSlug}${useComicId ? '&comicId='+mangaId : ''}`, this.URI), {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Origin: this.URI.origin,
            Referer: this.URI.href
        }
    }));
    return data.map(({ chapter_name: chapterName, chapter_slug: chapterSlug, chapter_id: chapterId }) => new Chapter(this, manga, `${manga.Identifier.replace(baseSlug, requestSlug)}/${chapterSlug}${useComicId ? '/' + chapterId : ''}`, chapterName));
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to {@link this} scraper's base url
 * @param useComicId - Extract comicId from slug for the api call. Otherwise only uses slug.
 */
export function ChaptersSinglePageAJAX(useComicId: boolean = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAX.call(this, manga, useComicId);
            }
        };
    };
}