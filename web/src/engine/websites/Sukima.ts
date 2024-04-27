import { Tags } from '../Tags';
import icon from './Sukima.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise((resolve, reject) => {

            PAGES_INFO.sort((a, b) => {
                return a.page_number - b.page_number;
            });

            resolve(PAGES_INFO.map(page => {
                return {
                    page_url : page.page_url,
                    shuffle_map : page.shuffle_map,
                    blocklen : BLOCKLEN
                }
            }));
     });
`;

type APIManga = {
    title: string,
    contents: {
        stories: APIChapter[]
    }[]
}

type APIChapter = {
    title_code: string,
    volume: number,
    story: number,
    info: {
        text: string
    }
}

type PageInfo = {
    page_url: string,
    shuffle_map: string,
    blocklen: number
}

type APIMangas = {
    items: {
        title_code: string,
        title_name: string
    }[]
    max_page: number
}

type APICategories = {
    rows: {
        more_btn: {
            link: string
        }
    }[]
}

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sukima', `Sukima`, 'https://www.sukima.me', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/book/title/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/\/(\w+)\/?$/)[1];
        const request = new Request(new URL(`/api/book/v1/title/${id}/`, this.URI).href);
        const data = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, id, data.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        const categories = await this.FetchPOST<APICategories>('/api/book/v1/free/', {store: false, genre: '0'});
        for (const category of categories.rows) {
            const uri = new URL(category.more_btn.link, this.URI);
            if (uri.searchParams.get('tag') != null) {
                for (let page = 1, run = true; run; page++) {
                    const mangas = await this.GetMangasFromPage(provider, page, [uri.searchParams.get('tag')]);
                    mangas.length > 0 ? mangaList.push(...mangas) : run = false;
                }
            }
        }
        return mangaList;
    }

    private async GetMangasFromPage(provider: MangaPlugin, page: number, tag :string[]= []): Promise<Manga[]>{
        const body = {
            'page': page,
            'sort_by': 0,
            'tag': tag
        };
        const pageContent = await this.FetchPOST<APIMangas>('/api/v1/search/', body);
        const mangas = pageContent.items.map(element => new Manga(this, provider, element.title_code, element.title_name));
        return page > pageContent.max_page ? [] : mangas;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/api/book/v1/title/${manga.Identifier}/`, this.URI).href);
        const books = await FetchJSON<APIManga>(request);
        const chapters : Chapter[]= [];

        books.contents.map(book => {
            book.stories.map(chapter => {
                const id = `/bv/t/${chapter.title_code}/v/${chapter.volume}/s/${chapter.story}/p/1`;
                const title = `(${chapter.volume.toString().padStart(3, '0')}-${chapter.story.toString().padStart(4, '0')})${chapter.info.text.trim()}`.replace(manga.Title, '').trim();
                chapters.push(new Chapter(this, manga, id, title));
            });
        });
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const pages = await FetchWindowScript<PageInfo[]>(request, pageScript, 1500);
        return pages.map(page => new Page(this, chapter, new URL(page.page_url), { Referer: request.url, ...page }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return DeScramble(blob, async (bitmap, ctx) => {
            const payload = page.Parameters as PageInfo;
            const shuffle_map: number[][] = JSON.parse(payload.shuffle_map);
            const xSplitCount = Math.floor(bitmap.width / payload.blocklen);
            const ySplitCount = Math.floor(bitmap.height / payload.blocklen);
            let count = 0;
            ctx.drawImage(bitmap, 0, ySplitCount * payload.blocklen + 1, bitmap.width, bitmap.height - ySplitCount * payload.blocklen, 0, ySplitCount * payload.blocklen, bitmap.width, bitmap.height - ySplitCount * payload.blocklen);

            for (let col = 0; col < xSplitCount; col++) {
                for (let row = 0; row < ySplitCount; row++) {
                    const dx = shuffle_map[count][0];
                    const dy = shuffle_map[count][1];
                    const sx = col * payload.blocklen;
                    const sy = row * payload.blocklen;
                    ctx.drawImage(bitmap, sx, sy, payload.blocklen, payload.blocklen, dx, dy, payload.blocklen, payload.blocklen);
                    count++;
                }
            }
        });
    }

    private async FetchPOST<T>(uri: string, body: unknown) {
        const request = new Request(new URL(uri, this.URI).href, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        return await FetchJSON<T>(request);
    }
}