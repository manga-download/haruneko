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
        chapter_slug: string,
        chapter_name: string
    }[]
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to {@link this} scraper's base url
 */
export async function FetchChaptersSinglePageAJAX(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
    const { data } = await FetchJSON<APIChapters>(new Request(new URL(`/Comic/Services/ComicService.asmx/ChapterList?slug=${manga.Identifier.split('/').at(-1)}`, this.URI), {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Origin: this.URI.origin,
            Referer: this.URI.href
        }
    }));
    return data.map(chapter => new Chapter(this, manga, `${manga.Identifier}/${chapter.chapter_slug}`, chapter.chapter_name));
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to {@link this} scraper's base url
 */
export function ChaptersSinglePageAJAX() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAX.call(this, manga);
            }
        };
    };
}