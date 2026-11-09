// used by MangaTaro/RoliaScans, no more informations

import { FetchJSON, FetchWindowScript } from "../../platform/FetchProvider";
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';

type ChaptersData = {
    mangaId: string;
    timestamp: number;
    token: string;
};

type APIChapters = {
    chapters: {
        chapter: string;
        title: string;
        url: string;
    }[]
};

@Common.MangaCSS<HTMLButtonElement>(/^{origin}\/manga\/[^/]+(\/)?$/, 'button[data-manga-title]', (button, uri) => ({
    id: uri.pathname,
    title: button.dataset.mangaTitle.trim()
}))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('img.comic-image')].map(el => el.dataset.src ?? el.src)`, 1500)
@Common.ImageAjax()
export class MangaPeakBase extends DecoratableMangaScraper {

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return Array.fromAsync(async function* () {
            for (let page = 1, run = true; run; page++) {
                const data = await FetchJSON<{ title: string, url: string; }[]>(new Request(new URL('/wp-json/manga/v1/load', this.URI), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ page })
                }));
                const mangas = data.map(({ url, title }) => new Manga(this, provider, new URL(url, this.URI).pathname, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { mangaId, timestamp, token } = await FetchWindowScript<ChaptersData>(new Request(new URL(manga.Identifier, this.URI)), `
            new Promise ( resolve => {
                let token = null;
                let timestamp = null;

                if (typeof generateToken === 'function') {
                    const result = generateToken();
                    token = result?.token;
                    timestamp = result?.timestamp;
                }

                resolve ({
                    mangaId : document.querySelector('[data-manga-id]').dataset.mangaId.trim(),
                    token, timestamp
                });
            });
        `, 1500);

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 500) {
                const url = new URL(`./auth/manga-chapters?manga_id=${mangaId}&offset=${offset}&limit=500&order=DESC}`, this.URI);
                if (token) {
                    url.searchParams.set('_t', token);
                    url.searchParams.set('_ts', `${timestamp}`);
                }

                const { chapters: chaptersData } = await FetchJSON<APIChapters>(new Request(url));
                const chapters = chaptersData.map(({ chapter, title, url }) => new Chapter(this, manga, new URL(url).pathname, ['Ch.', chapter, title].joinTitleSegments()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }
}