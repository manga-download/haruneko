import { Tags } from '../Tags';
import icon from './Luscious.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIMangaPage = {
    album: {
        list: {
            items: APIManga[]
        }
    }
};

type APIManga = {
    id: number;
    title: string;
    slug: string;
    url: string;
};

type PagesResult = {
    picture: {
        list: {
            info: {
                has_next_page: boolean
            },
            items: { url_to_original: string }[]
        }
    }
};

@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://www.luscious.net/graphql/nobatch/';

    public constructor() {
        super('luscious', 'Luscious', 'https://www.luscious.net', Tags.Media.Comic, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/albums/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const title = await FetchWindowScript<string>(new Request(mangaUrl), 'document.querySelector("main h1.album-heading").textContent.trim();', 1500);
        return new Manga(this, provider, mangaUrl.pathname.match(/_(\d+)\/?$/).at(1), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const query = `
            query AlbumList($input: AlbumListInput!) {
                album {
                    list(input: $input) {
                        items {
                            ...AlbumInSearchList
                        }
                    }
                }
            }
            fragment AlbumInSearchList on Album {
                id
                title
            }
        `;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { album: { list: { items } } } = await this.FetchAPI<APIMangaPage>('AlbumList', {
                    input: {
                        display: 'date_trending',
                        filters: [{ name: 'album_type', value: 'manga' }, { name: 'restrict_genres', value: 'loose' }],
                        page,
                        items_per_page: 30//dont change items_per_page to more than 30
                    }
                }, query);
                const mangas = items.map(({ id, title }) => new Manga(this, provider, `${ id }`, title.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        type This = typeof this;
        const query = `
            query AlbumListOwnPictures($input: PictureListInput!) {
                picture {
                    list(input: $input) {
                        info {
                            ...FacetCollectionInfo
                        }
                        items {
                            url_to_original
                        }
                    }
                }
            }
            fragment FacetCollectionInfo on FacetCollectionInfo {
                has_next_page
            }
        `;
        const variables = {
            input: {
                filters: [{ name: 'album_id', value: chapter.Identifier }],
                display: 'position',
                items_per_page: 50, //dont change items_per_page to more than 50
                page: 1
            }
        };
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                variables.input.page = page;
                const { picture: { list: { items, info: { has_next_page } } } } = await this.FetchAPI<PagesResult>('AlbumListOwnPictures', variables, query);
                const pages = items.map(({ url_to_original: url }) => new Page(this, chapter, new URL(url)));
                yield* pages, run = has_next_page;
            }
        }.call(this));
    }

    private async FetchAPI<T extends JSONElement>(operationName: string, variables: JSONObject, query: string): Promise<T> {
        const url = new URL(this.apiUrl);
        url.searchParams.set('query', query);
        url.searchParams.set('operationName', operationName);
        url.searchParams.set('variables', JSON.stringify(variables));
        return (await FetchJSON<APIResult<T>>(new Request(url))).data;
    }
}