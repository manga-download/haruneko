import { Tags } from '../Tags';
import icon from './DreComicPlus.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { type Priority } from '../taskpool/TaskPool';
import * as Common from './decorators/Common';
import { GetBytesFromBase64 } from '../BufferEncoder';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIResult<T> = {
    items: T;
};

type APIManga = {
    code: string;
    name: string;
};

type APIChapter = {
    code: string;
    name: string;
};

type APIMangas = APIResult<APIManga[]>;
type APIChapters = APIResult<APIChapter[]>;

type APIPages = {
    pages: {
        image_url: string;
        iv: string;
    }[];
    session_key: string;
};

type ChapterID = {
    type: 'episode' | 'volume';
    code: string;
};

type PageData = {
    key: string;
    iv: string;
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+/, 'h1#series-info-title', (el, uri) => ({
    id: uri.pathname.match(/\/series\/([^/]+)/).at(1),
    title: el.textContent.trim()
}))
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.drecomi-plus.jp/api/v1/app/';

    public constructor() {
        super('drecomicplus', 'DreComicPlus', 'https://drecomi-plus.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIMangas>(new Request(new URL(`./series?page=${page}&limit=100`, this.apiUrl)));
                const mangas = items.map(({ code, name }) => new Manga(this, provider, code, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;

        const chapters = await Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIChapters>(new Request(new URL(`./episodes?series_code=${manga.Identifier}&page=${page}&limit=200`, this.apiUrl)));
                const chapters = items.map(({ code, name }) => new Chapter(this, manga, JSON.stringify({ code, type: 'episode' }), name.replace(manga.Title, '').trim() || name));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));

        const volumes = await Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIChapters>(new Request(new URL(`./volumes?series_code=${manga.Identifier}&page=${page}&limit=200`, this.apiUrl)));
                const volumes = items.map(({ code, name }) => new Chapter(this, manga, JSON.stringify({ code, type: 'volume' }), name.replace(manga.Title, '').trim() || name));
                volumes.length > 0 ? yield* volumes : run = false;
            }
        }.call(this));

        return [...chapters, ...volumes];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { code, type }: ChapterID = JSON.parse(chapter.Identifier);
        //url: `/viewer/volumes/${ ee }/trial-session`,
        //url: `/viewer/episodes/${e}/session`,
        //url: `/viewer/volumes/${e}/session`,

        let pagesData = await FetchJSON<APIPages>(new Request(new URL(`./viewer/${type}s/${code}/session`, this.apiUrl), {
            method: 'POST',
            credentials: 'include'
        }));

        //No data for volume? test trial call
        if (type === 'volume' && !pagesData.pages) {
            pagesData = await FetchJSON<APIPages>(new Request(new URL(`./viewer/volumes/${code}/trial-session`, this.apiUrl), {
                method: 'POST',
                credentials: 'include'
            }));

        }
        if (!pagesData.pages) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        return pagesData.pages.map(({ image_url: url, iv }) => new Page(this, chapter, new URL(url), { key: pagesData.session_key, iv }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return this.DecryptImage(await blob.arrayBuffer(), page.Parameters.key, page.Parameters.iv);
    }

    private async DecryptImage(encrypted: ArrayBuffer, keyData: string, iv: string): Promise<Blob> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromBase64(iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromBase64(keyData), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return Common.GetTypedData(decrypted);
    }
}