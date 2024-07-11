import { Tags } from '../Tags';
import icon from './Tapas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: {
        items: APIManga[]
    }
}

type APISingleManga = {
    data: {
        id: number,
        title: string
    }
}

type APIManga = {
    seriesId: number,
    title: string
}

type APIChapters = {
    data: {
        episodes: {
            id: number,
            title : string
        }[]
    }
}

@Common.PagesSinglePageCSS('article.viewer__body img.content__img')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://story-api.tapas.io/cosmos/api/v1/landing/';

    public constructor() {
        super('tapas', `Tapas`, 'https://tapas.io', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Official, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const seriesId = (await FetchCSS<HTMLMetaElement>(new Request(url), 'meta[property="al:android:url"]'))[0].content.replace(/\/info$/, '').split('/').pop();
        const { data } = await FetchJSON<APISingleManga>(new Request(new URL(`/series/${seriesId}?`, this.URI), {
            headers: {
                Accept: 'application/json, text/javascript, */*;',
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }));
        return new Manga(this, provider, data.id.toString(), data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin) {
        const url = new URL(`${this.apiUrl}genre?category_type=COMIC&size=200&page=${page}`);
        const { data: { items } } = await FetchJSON<APIMangas>(new Request(url));
        return items.map(manga => new Manga(this, provider, manga.seriesId.toString(), manga.title.trim()));
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga : Manga, page: number) {
        const url = new URL(`/series/${manga.Identifier}/episodes?page=${page}`, this.URI);
        const { data: { episodes } } = await FetchJSON<APIChapters>(new Request(url));
        return episodes.map(chapter => new Chapter(this, manga, `/episode/${chapter.id}`, chapter.title.trim()));
    }

}