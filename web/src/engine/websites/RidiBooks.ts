import { Tags } from '../Tags';
import icon from './RidiBooks.webp';
import { FetchGraphQL, FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIResult<T> = {
    success: boolean;
    data?: T;
    error?: {
        code: string;
    };
    message: string;
};

type APIMangas = APIResult<{
    items: {
        book: {
            bookId: string;
            title: string;
            serial: {
                title: string;
            };
        };
    }[];
    pagination: {
        nextPage: string;
    };
}>;

type APIChapters = {
    riGrid: {
        cells: {
            bookDetailHome: {
                episodeBookListCell: {
                    cell: null | {
                        books: {
                            bookId: string;
                            title: string;
                            metadata: {
                                file: {
                                    type: string;
                                };
                            };
                        }[];
                    };
                };
            };
        };
    };
};

type APIPages = APIResult<{
    type: string;
    pages: {
        src: string;
    }[];
}>;

@Common.MangaCSS(/^{origin}\/books\/\d+$/, 'title', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.split(' - ').at(0).trim()
}))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.ridibooks.com/';
    private readonly graphqlURL = `${this.URI.origin}/graphql`;

    public constructor() {
        super('ridibooks', 'RidiBooks', 'https://ridibooks.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (const category of [
                '1500', //comic book
                '6100', //comic series
                '1600', //Webtoon
                //'3000', //Light Novel
                //'1700', //Romance e-book,
                //'1650', //Romance Web Fiction
                //'6000', //Rofan e-book
                //'6050', //Rofan
                //'1710', //Fantasy eBook
                //'1750', //Fantasy Web Fiction
                //'4100', //BL Novel eBook
                //'4150', //BL Web Fiction
                '4200', //BL Cartoon eBook
                '4250', //BL Webtoon
            ]) {
                const uri = new URL(`./v2/category/books?platform=web&tab=books&category_id=${category}&order_by=popular&limit=200`, this.apiURL);
                for (let offset = 0, run = true; run; offset += 200) {
                    uri.searchParams.set('offset', `${offset}`);
                    const { data: { items, pagination: { nextPage } } } = await FetchJSON<APIMangas>(new Request(uri));
                    yield* items.map(({ book: { bookId, serial, title } }) => new Manga(this, provider, `${bookId}`, (serial?.title ?? title).trim()));
                    run = !!nextPage;
                }
            }
        }.call(this))).distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        //handle old book id (/books/1234) flawlessly
        const mangaId = manga.Identifier.split('/').filter(Boolean).at(-1);
        const deviceId = crypto.randomUUID();
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run;) {
                const { riGrid: { cells: { bookDetailHome: { episodeBookListCell: { cell } } } } } = await FetchGraphQL<APIChapters>(new Request(this.graphqlURL), 'BooksDetailEpisodeBooks', `
                    query BooksDetailEpisodeBooks(
                      $id: UUID!
                      $context: BookDetailHomeEpisodeBookListCellContext!
                    ) {
                      riGrid {
                        cells {
                          bookDetailHome {
                            episodeBookListCell(id: $id, context: $context) {
                              cell {
                                ...BooksDetailEpisodeBookList
                              }
                            }
                          }
                        }
                      }
                    }
                    fragment BooksDetailEpisodeBookList on BookDetailHomeEpisodeBookList {
                      books {
                        bookId
                        title
                        metadata {
                            file {
                                type
                            }
                        }
                      }
                    }
                `, {
                    context: {
                        bookId: mangaId,
                        deviceType: 'DESKTOP',
                        order: 'LATEST',
                        tabType: 'RENT',
                        pagination: {
                            limit: 200,
                            offset
                        }
                    },
                    id: deviceId
                });
                const chapters = (cell?.books || [])
                    .filter(({ metadata: { file: { type } } }) => type !== 'CHARACTER_COUNT') //filter Novels (epubs)
                    .map(({ bookId, title }) => new Chapter(this, manga, bookId, title.replace(manga.Title, '').trim() || title.trim()));
                chapters.length > 0 ? yield* chapters : run = false;
                offset += chapters.length;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data, success, message, error } = await FetchJSON<APIPages>(new Request(new URL('/api/web-viewer/generate', this.URI), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id: chapter.Identifier }),
        }));

        if (!success) {
            if (error?.code === 'NOT_AUTHORIZED') throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
            throw new Error(`${message} (${error?.code})`);
        }
        return data.pages.map(({ src }) => new Page(this, chapter, new URL(src, this.URI)));
    }
}