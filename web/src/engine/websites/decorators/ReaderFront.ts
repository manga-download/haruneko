// Readerfornt template : https://github.com/dvaJi/ReaderFront

import { FetchGraphQL } from '../../platform/FetchProvider';
import { type MangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import { Tags } from '../../Tags';
import * as Common from './Common';

const languageMap = {
    'es': 1,
    'en': 2
};

const DefaultLanguages: string[] = [];

const reverselanguageMap = {
    1: 'es',
    2: 'en'
};

const tagsLanguageMap = {
    1: Tags.Language.Spanish,
    2: Tags.Language.English
};

type APIMangas = {
    works: {
        id: number,
        stub: string,
        name: string,
        language: number
    }[]
}

type APIManga = {
    work: {
        id: number,
        stub: number,
        name: string,
        language: number
    }
};

type MangaIdentifier = {
    id: number,
    stub: string,
    language: number
};

type APIChapters = {
    work: {
        chapters: {
            id: number,
            stub: string,
            volume: number,
            chapter: number,
            subchapter: number,
            name: string,
            language: number
        }[]
    }
}

type APIPages = {
    chapterById: {
        uniqid: string,
        work: {
            uniqid: string,
        },
        pages: {
            id: number,
            filename: string
        }[]
    }
}

/***********************************************
 ******** Manga Extraction Methods ********
 ***********************************************/

/**
 * A class decorator that adds the ability to extract a manga from any {@link url}
 * The last part of the url will be used as an id to call the api and get the title
 * @param apiUrl - The url of the graphql api
 */
async function FetchMangaAJAX(this: MangaScraper, provider: MangaPlugin, url: string, apiUrl: string): Promise<Manga> {
    const uri = new URL(url);
    const language = uri.pathname.match(/work\/([a-z]{2})\/[^/]+/).last();
    const slug = uri.pathname.match(/work\/[a-z]{2}\/([^/]+)/).last();

    const query = `
        query Work($language: Int, $stub: String) {
            work(language: $language, stub: $stub, showHidden: true) {
                id
                stub
                name
                language
            }   
        }
    `;

    const variables: JSONObject = {
        language: languageMap[language],
        stub: slug
    };

    const { work } = await FetchGraphQL<APIManga>(new Request(apiUrl), 'Work', query, variables);
    const id = JSON.stringify({
        id: work.id,
        language: work.language,
        stub: work.stub
    });

    const title = `${work.name.trim()} [${reverselanguageMap[work.language]}]`;
    const manga = new Manga(this, provider, id, title);
    manga.Tags.Value.push(tagsLanguageMap[work.language]);
    return manga;
}

/**
 * A class decorator that adds the ability to extract a manga from any url that matches the given {@link pattern}.
 * The last part of the url will be used as an id to call the api and get the title
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param apiUrl - The url of the graphql api
 */
export function MangaAJAX(pattern: RegExp, apiUrl: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaAJAX.call(this, provider, url, apiUrl);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * ...
 */
async function FetchMangasSinglePageAJAX(this: MangaScraper, provider: MangaPlugin, apiUrl: string, languages: string[]): Promise<Manga[]> {
    const mappedLanguages: number[] = [];
    for (const lang of languages) {
        mappedLanguages.push(languageMap[lang]);
    }

    const variables: JSONObject = {
        languages: mappedLanguages
    };
    const query = `
        query Works($languages: [Int]) {
            works(languages: $languages, orderBy: "ASC", sortBy: "stub", first: 250, offset: 0, showHidden: true) {
                id
                stub
                name
                language
            }
        }
    `;
    const { works: entries } = await FetchGraphQL<APIMangas>(new Request(apiUrl), 'Works', query, variables);
    return entries.map(entry => {
        const id = JSON.stringify({
            id: entry.id,
            language: entry.language,
            stub: entry.stub
        });
        const title = `${entry.name.trim()} [${reverselanguageMap[entry.language]}]`;
        const manga = new Manga(this, provider, id, title);
        manga.Tags.Value.push(tagsLanguageMap[entry.language]);
        return manga;
    });

}

/**
 * A class decorator that adds the ability to extract a manga list using the website api.
 *  @param apiUrl - The url of the graphql api
 *  @param languages - an array list of langage codes to fetch e.g ['en', 'es']. If empty, we get everything.
 */
export function MangasSinglePageAJAX(apiUrl: string, languages = DefaultLanguages) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageAJAX.call(this, provider, apiUrl, languages);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * ...
 */
async function FetchChapterSinglePageAJAX(this: MangaScraper, apiUrl: string, manga: Manga): Promise<Chapter[]> {
    const mangaObj: MangaIdentifier = JSON.parse(manga.Identifier);

    const query = `
        query Work($language: Int, $stub: String) {
            work(language: $language, stub: $stub, showHidden: true) {
                chapters {
                    id
                    stub
                    volume
                    chapter
                    subchapter
                    name
                    language
                }
            }
        }
    `;

    const variables: JSONObject = {
        language: mangaObj.language,
        stub: mangaObj.stub
    };

    const { work: { chapters: entries } } = await FetchGraphQL<APIChapters>(new Request(apiUrl), 'Work', query, variables);
    return entries.map(entry => {
        const title = [
            `Vol. ${entry.volume}`,
            `Ch. ${entry.chapter}.${entry.subchapter}`,
            entry.name ? '-' : '',
            entry.name ?? '',
        ].join(' ').trim();
        const chapter = new Chapter(this, manga, String(entry.id), title);
        chapter.Tags.Value.push(tagsLanguageMap[mangaObj.language]);
        return chapter;
    });
}

/**
 * A class decorator that adds the ability to extract chapter list from a manga using the website api url
 * @param apiUrl - The url of the graphql api
 */
export function ChaptersSinglePageAJAX(apiUrl: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChapterSinglePageAJAX.call(this, apiUrl, manga);
            }
        };
    };
}

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * ...
 */
async function FetchPagesSinglePageAJAX(this: MangaScraper, apiUrl: string, cdnUrl: string, chapter: Chapter): Promise<Page[]> {
    const variables: JSONObject = {
        id: parseInt(chapter.Identifier)
    };

    const query = `
        query ChapterById($id: Int) {
            chapterById(id: $id, showHidden: true) {
                uniqid
                work {
                    uniqid
                }
                pages {
                    id
                    filename
                }
            }
        }
    `;
    const { chapterById: { pages, work: { uniqid: mangaID }, uniqid: chapterID } } = await FetchGraphQL<APIPages>(new Request(apiUrl), 'ChapterById', query, variables);
    return pages.map(page => {
        const uri = new URL(['/works', mangaID, chapterID, page.filename].join('/'), cdnUrl);
        return new Page(this, chapter, uri);
    });
}

/**
 * A class decorator that adds the ability to extract pages list from a chapter using the website api URL and CDN url
 * @param apiUrl - The url of the graphql api
 * @param cdnUrl - the base url where images are stored. It can be the same as {@link apiUrl}
 */
export function PagesSinglePageAJAX(apiUrl: string, cdnUrl: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAJAX.call(this, apiUrl, cdnUrl, chapter);
            }
        };
    };
}