// https://noveldex.io/

import { Fetch, FetchJSON, FetchNextJS } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';
import type { Priority } from '../../taskpool/DeferredTask';

type APIMangas = {
    data: {
        title: string;
        urlSlug: string;
    }[];
};

type HydratedChapters = {
    chapters: {
        number: number;
    }[];
};

type HydratedPages = {
    pages: {
        imageUrl: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/series\/comic\/[^/]+$/, 'meta[property="og:title"]')
export class NovelDexTheme extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./series?page=${page}&limit=100`, this.apiURL)));
                const mangas = data.map(({ urlSlug, title }) => new Manga(this, provider, `/series/comic/${urlSlug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.map(({ number }) => new Chapter(this, manga, `${manga.Identifier}/chapter/${number}`, ['Chapter', number].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const { pages } = await FetchNextJS<HydratedPages>(new Request(chapterUrl), data => 'pages' in data);
        return pages.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl, this.URI), { Referer: chapterUrl.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const headers = {
                'Accept': 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
                'Referer': page.Parameters.Referer,
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Dest': 'image'
            };
            const response = await Fetch(new Request(page.Link, { signal, headers }));
            return response.blob();
        }, priority, signal);
    };
}