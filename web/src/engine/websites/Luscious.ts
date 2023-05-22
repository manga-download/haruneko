import { Tags } from '../Tags';
import icon from './Luscious.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest } from './../FetchProvider';

//we do not use FetchGraphQL on purpose, since this website use GET and not POST and ofc pass parameters and query using the url

const apiUrl = 'https://apicdn.luscious.net/graphql/nobatch/';

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

    public constructor() {
        super('luscious', `Luscious`, 'https://www.luscious.net', Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/www\.luscious\.net\/albums\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname.match(/_(\d+)\/?$/)[1];
        const request = new FetchRequest(url);
        const name = (await FetchCSS(request, 'main h1.album-heading')).pop().textContent.trim();
        return new Manga(this, provider, id, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL(apiUrl);
        url.searchParams.set('operationName', 'AlbumList');
        url.searchParams.set('query', '%20query%20AlbumList(%24input%3A%20AlbumListInput!)%20%7B%20album%20%7B%20list(input%3A%20%24input)%20%7B%20info%20%7B%20...FacetCollectionInfo%20%7D%20items%20%7B%20...AlbumInSearchList%20%7D%20%7D%20%7D%20%7D%20fragment%20FacetCollectionInfo%20on%20FacetCollectionInfo%20%7B%20page%20has_next_page%20has_previous_page%20total_items%20total_pages%20items_per_page%20url_complete%20%7D%20fragment%20AlbumInSearchList%20on%20Album%20%7B%20__typename%20id%20title%20description%20created%20modified%20like_status%20moderation_status%20number_of_favorites%20number_of_dislikes%20number_of_pictures%20number_of_animated_pictures%20number_of_duplicates%20slug%20is_manga%20url%20download_url%20labels%20permissions%20cover%20%7B%20width%20height%20size%20url%20%7D%20created_by%20%7B%20id%20url%20name%20display_name%20user_title%20avatar_url%20%7D%20language%20%7B%20id%20title%20url%20%7D%20tags%20%7B%20category%20text%20url%20count%20%7D%20genres%20%7B%20id%20title%20slug%20url%20%7D%20%7D%20');
        const variables = {
            input: {
                display: 'date_trending',
                filters: [{ name: 'album_type', value: 'manga' }, { name: 'restrict_genres', value: 'loose' }],
                page: page,
                items_per_page: 30//dont change items_per_page to more than 30
            }
        };

        url.searchParams.set('variables', JSON.stringify(variables));
        const request = new FetchRequest(url.href, { headers: { 'content-type': 'application/json', 'accept': '*/*' } });
        const data = await FetchJSON<APIMangaPage>(request);
        return data.data.album.list.items.map(manga => new Manga(this, provider, String(manga.id), manga.title.trim()));

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pagelist = [];
        for (let page = 1, run = true; run; page++) {
            const pagesResults = await this._getPagesFromChapterPage(page, chapter);
            if (pagesResults.data.picture.list.items.length > 0) {
                pagesResults.data.picture.list.items.forEach(element => pagelist.push(new Page(this, chapter, new URL(element.url_to_original))));
            }
            run = pagesResults.data.picture.list.info.has_next_page;
        }
        return pagelist;
    }

    private async _getPagesFromChapterPage(page: number, chapter: Chapter) : Promise<PagesResult> {
        const url = new URL(apiUrl);
        url.searchParams.set('operationName', 'AlbumListOwnPictures');
        url.searchParams.set('query', '%20query%20AlbumListOwnPictures(%24input%3A%20PictureListInput!)%20%7B%20picture%20%7B%20list(input%3A%20%24input)%20%7B%20info%20%7B%20...FacetCollectionInfo%20%7D%20items%20%7B%20__typename%20id%20title%20description%20created%20like_status%20number_of_comments%20number_of_favorites%20moderation_status%20width%20height%20resolution%20aspect_ratio%20url_to_original%20url_to_video%20is_animated%20position%20tags%20%7B%20category%20text%20url%20%7D%20permissions%20url%20thumbnails%20%7B%20width%20height%20size%20url%20%7D%20%7D%20%7D%20%7D%20%7D%20fragment%20FacetCollectionInfo%20on%20FacetCollectionInfo%20%7B%20page%20has_next_page%20has_previous_page%20total_items%20total_pages%20items_per_page%20url_complete%20%7D%20');
        const variables = {
            input: {
                filters: [{ name: 'album_id', value: chapter.Identifier }],
                display: 'position',
                items_per_page: 50,//dont change items_per_page to more than 50
                page: page
            }
        };
        url.searchParams.set('variables', JSON.stringify(variables));
        const request = new FetchRequest(url.href, { headers: { 'content-type': 'application/json', 'accept': '*/*' } });
        return await FetchJSON<PagesResult>(request);
    }
}
