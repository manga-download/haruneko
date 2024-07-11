import { Tags } from '../Tags';
import icon from './Luscious.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIMangaPage = {
    data: {
        album: {
            list: {
                items: APIManga[]
            }
        }
    }
};

type APIManga = {
    id: number,
    title: string,
    slug: string,
    url: string
};

type PagesResult = {
    data: {
        picture: {
            list: {
                info: {
                    has_next_page: boolean
                },
                items: { url_to_original: string }[]
            }
        }
    }
}

@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://apicdn.luscious.net/graphql/nobatch/';

    public constructor() {
        super('luscious', `Luscious`, 'https://www.luscious.net', Tags.Media.Comic, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/albums/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname.match(/_(\d+)\/?$/)[1];
        const request = new Request(url);
        const name = (await FetchCSS(request, 'main h1.album-heading')).pop().textContent.trim();
        return new Manga(this, provider, id, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL(this.apiUrl);
        url.searchParams.set('operationName', 'AlbumList');
        const query = `query AlbumList($input: AlbumListInput!) {
                  album {
                    list(input: $input) {
                      items {
                        ...AlbumInSearchList
                      }
                    }
                  }
                }
                fragment AlbumInSearchList on Album {
                  __typename
                  id
                  title
                  slug
                  language {
                    id
                    title
                    url
                  }
                }
`;
        url.searchParams.set('query', query);

        const variables = {
            input: {
                display: 'date_trending',
                filters: [{ name: 'album_type', value: 'manga' }, { name: 'restrict_genres', value: 'loose' }],
                page: page,
                items_per_page: 30//dont change items_per_page to more than 30
            }
        };

        url.searchParams.set('variables', JSON.stringify(variables));
        const request = new Request(url.href, { headers: { 'content-type': 'application/json', 'accept': '*/*' } });
        const data = await FetchJSON<APIMangaPage>(request);
        return data.data.album.list.items.map(manga => new Manga(this, provider, String(manga.id), manga.title.trim()));

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pagelist = [];
        for (let page = 1, run = true; run; page++) {
            const pagesResults = await this.GetPagesFromChapterPage(page, chapter);
            if (pagesResults.data.picture.list.items.length > 0) {
                pagesResults.data.picture.list.items.forEach(element => pagelist.push(new Page(this, chapter, new URL(element.url_to_original))));
            }
            run = pagesResults.data.picture.list.info.has_next_page;
        }
        return pagelist;
    }

    private async GetPagesFromChapterPage(page: number, chapter: Chapter): Promise<PagesResult> {
        const url = new URL(this.apiUrl);
        url.searchParams.set('operationName', 'AlbumListOwnPictures');
        const query = `
                query AlbumListOwnPictures($input: PictureListInput!) {
                  picture {
                    list(input: $input) {
                      info {
                        ...FacetCollectionInfo
                      }
                      items {
                        __typename
                        url_to_original
                      }
                    }
                  }
                }
                fragment FacetCollectionInfo on FacetCollectionInfo {
                  has_next_page
                }
        `;
        url.searchParams.set('query', query);
        const variables = {
            input: {
                filters: [{ name: 'album_id', value: chapter.Identifier }],
                display: 'position',
                items_per_page: 50, //dont change items_per_page to more than 50
                page: page
            }
        };
        url.searchParams.set('variables', JSON.stringify(variables));
        const request = new Request(url.href, { headers: { 'content-type': 'application/json', 'accept': '*/*' } });
        return await FetchJSON<PagesResult>(request);
    }
}
