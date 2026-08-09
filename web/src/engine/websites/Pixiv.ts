import { Tags } from '../Tags';
import icon from './Pixiv.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    body: T;
};

type APIIlust = {
    illustId: string;
    illustTitle: string;
};

type APISerie = {
    illustSeries: {
        id: string;
        title: string;
    }[];
};

type APIChapters = {
    thumbnails: {
        illust: {
            id: string;
            title: string;
        }[];
    },
    page: {
        series: {
            workId: string;
        }[];
    };
};

type APIPage = {
    urls: {
        original: string;
    };
};

@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://www.pixiv.net/ajax/';

    public constructor () {
        super('pixiv', 'Pixiv', 'https://www.pixiv.net', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/([^/]+/artworks/|user/\\d+/series/)\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        if (/\/[^/]+\/artworks\/\d+$/.test(mangaUrl.pathname)) {
            const id = mangaUrl.pathname.match(/\/artworks\/(\d+)$/).at(1);
            const { body: { illustId, illustTitle } } = await FetchJSON<APIResult<APIIlust>>(new Request(new URL(`./illust/${id}?lang=en`, this.apiURL)));
            return new Manga(this, provider, `artwork-${illustId}`, illustTitle.trim());
        } else {
            const id = mangaUrl.pathname.match(/\/series\/(\d+)/).at(-1);
            const { body: { illustSeries } } = await FetchJSON<APIResult<APISerie>>(new Request(new URL(`./series/${id}?p=1&lang=en`, this.apiURL)));
            const title = illustSeries.filter(s => s.id === id).map(s => s.title.trim()).at(-1);
            return new Manga(this, provider, id, title.trim());
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (manga.Identifier.startsWith('artwork-')) {
            return [ new Chapter(this, manga, manga.Identifier.match(/artwork-(\d+)$/).at(-1), manga.Title) ];
        } else {
            type This = typeof this;
            return Array.fromAsync(async function* (this: This) {
                for (let page = 1, run = true; run ; page++) {
                    const { body: { thumbnails: { illust }, page: { series } } } = await FetchJSON<APIResult<APIChapters>>(new Request(new URL(`./series/${manga.Identifier}?p=${page}&lang=en`, this.apiURL)));
                    const chapters = series.map(({workId }) => {
                        const chapterContents = illust.find(c => c.id === workId);
                        if (chapterContents) return new Chapter(this, manga, chapterContents.id, chapterContents.title);
                    });
                    chapters.length > 0 ? yield* chapters : run = false;
                }
            }.call(this));
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { body } = await FetchJSON<APIResult<APIPage[]>>(new Request(new URL(`./illust/${chapter.Identifier}/pages?lang=en`, this.apiURL)));
        return body.map(image => new Page(this, chapter, new URL(image.urls.original)));
    }
}