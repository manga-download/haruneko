import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    body: T
}

type APIIlust = {
    illustId: string,
    illustTitle: string,
}

type APISerie = {
    illustSeries: {
        id: string,
        title: string
    }[]
}

type APIChapters = {
    thumbnails: {
        illust: {
            id: string,
            title: string
        }[]
    },
    page: {
        series: {
            workId: string
        }[]
    }
}

type APIPage = {
    urls: {
        original: string
    }
}

@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://www.pixiv.net/ajax/';

    public constructor() {
        super('pixiv', 'Pixiv', 'https://www.pixiv.net', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        //https://www.pixiv.net/en/artworks/105844494
        //https://www.pixiv.net/user/11750032/series/88243
        return new RegExpSafe(`^${this.URI.origin}/([^/]+/artworks/|user/\\d+/series/)\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        if (/\/[^/]+\/artworks\/\d+$/.test(mangaUrl.pathname)) {
            const id = mangaUrl.pathname.match(/\/artworks\/(\d+)/)[1];
            const { body: { illustId, illustTitle } } = await FetchJSON<APIResult<APIIlust>>(new Request(new URL(`./illust/${id}?lang=en`, this.apiURL)));
            return new Manga(this, provider, `artwork-${illustId}`, illustTitle.trim());
        } else {
            const id = mangaUrl.pathname.match(/\/series\/(\d+)/)[1];
            const { body: { illustSeries } } = await FetchJSON<APIResult<APISerie>>(new Request(new URL(`./series/${id}?p=1&lang=en`, this.apiURL)));
            const title = illustSeries.filter(s => s.id === id).map(s => s.title.trim()).pop();
            return new Manga(this, provider, id, title.trim());
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        if (manga.Identifier.startsWith('artwork-')) {
            chapterList.push(new Chapter(this, manga, manga.Identifier.match(/artwork-(\d+)/).at(1), manga.Title));
        } else {
            for (let page = 1, run = true; run; page++) {
                const chapters = await this.FetchChaptersFromPage(manga, page);
                chapters.length > 0 ? chapterList.push(...chapters) : run = false;
            }
        }
        return chapterList;
    }

    private async FetchChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const { body: { thumbnails: { illust }, page: { series } } } = await FetchJSON<APIResult<APIChapters>>(new Request(new URL(`./series/${manga.Identifier}?p=${page}&lang=en`, this.apiURL)));

        return series.map(chapter => {
            const chapterContents = illust.find(c => c.id === chapter.workId);
            if (chapterContents) return new Chapter(this, manga, chapterContents.id, chapterContents.title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { body } = await FetchJSON<APIResult<APIPage[]>>(new Request(new URL(`./illust/${chapter.Identifier}/pages?lang=en`, this.apiURL)));
        return body.map(image => new Page(this, chapter, new URL(image.urls.original)));
    }

}