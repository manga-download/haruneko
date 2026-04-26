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

@Common.MangaCSS<HTMLButtonElement>(/^{origin}\/manga\/[^/]+(\/)?$/, 'button[data-manga-title]', (button, uri) => ({ id: uri.pathname, title: button.dataset.mangaTitle.trim() }))
@Common.ChapterURL()
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
                const { token, timestamp } = generateToken();
                resolve ({
                    mangaId : document.querySelector('[data-manga-id]').dataset.mangaId.trim(),
                    token, timestamp
                });
            });
        `);
        const { chapters } = await FetchJSON<APIChapters>(new Request(new URL(`./auth/manga-chapters?manga_id=${mangaId}&offset=0&limit=9999&order=DESC&_t=${token}&_ts=${timestamp}`, this.URI)));
        return chapters.map(({ chapter, title, url }) => new Chapter(this, manga, new URL(url).pathname, ['Ch.', chapter, title].join(' ').trim()));
    }
}