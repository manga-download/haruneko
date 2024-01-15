import { Tags } from '../Tags';
import icon from './ComicWalker.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchHTML, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type TEndpoints = {
    nc: string,
    cw: string
}

type APIPages = {
    data: {
        result: {
            meta: {
                source_url: string,
                drm_hash: string
            }
        }[]
    }
}

const langMap = {
    en: Tags.Language.English,
    tw: Tags.Language.Chinese,
    jp: Tags.Language.Japanese
};

type MangaID = {
    id: string,
    langCode: string

}

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicwalker', `コミックウォーカー (ComicWalker)`, 'https://comic-walker.com', Tags.Language.Japanese, Tags.Language.Chinese, Tags.Language.English, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/contents/detail/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const document = await FetchHTML(new Request(url));
        const title = document.querySelector('div#mainContent div#detailIndex div.comicIndex-box h1').textContent.trim();

        //infer manga language from page meta url
        //<meta property="og:url" content="https://comic-walker.com/tw/contents/detail/KDCW_KS02000002030000_68/" />

        const metaUrl = new URL(document.querySelector<HTMLMetaElement>('meta[property="og:url"]').content);
        const langCode = metaUrl.pathname.match(/^\/([a-z]{2})\//)[1];

        const mangaid: MangaID = {
            id: new URL(url).pathname,
            langCode: langCode
        };
        const manga = new Manga(this, provider, JSON.stringify(mangaid), title);
        manga.Tags.push(langMap[langCode]);

        return manga;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList : Manga[] = [];
        for (const language of ['en', 'tw', 'jp']) {
            await this.setLanguage(language);
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, '/contents/list/?p={page}', 'div.comicPage ul.tileList li a', 1, 1, 0, Common.AnchorInfoExtractor(false, '.contents_tile_epi'));
            const langMangas = mangas.map(manga => new Manga(this, provider, JSON.stringify({ id: manga.Identifier, langCode: language }), manga.Title));
            langMangas.forEach(manga => manga.Tags.push(langMap[language]));
            mangasList.push(...langMangas);
        }
        return mangasList;
    }

    private async setLanguage(language: string): Promise<void> {
        const request = new Request(`${this.URI.origin}/set_lang/${language}/`);
        (await Fetch(request)).text();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaID: MangaID = JSON.parse(manga.Identifier);
        await this.setLanguage(mangaID.langCode);

        const request = new Request(new URL(mangaID.id, this.URI).href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div#ulreversible ul#reversible li a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname + chapter.search, chapter.title.replace(manga.Title, '').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const language = (JSON.parse(chapter.Parent.Identifier) as MangaID).langCode;
        await this.setLanguage(language);

        //get endpoints data
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const mainApp = await FetchCSS(request, 'main#app');
        const endpoints: string | TEndpoints = mainApp[0].dataset.apiEndpointUrl ? mainApp[0].dataset.apiEndpointUrl : JSON.parse(mainApp[0].dataset.apiEndpointUrls);
        const uri = `${(endpoints as TEndpoints).nc || (endpoints as TEndpoints).cw || endpoints}/api/v1/comicwalker/episodes/${mainApp[0].dataset.episodeId}/frames`;

        const { data } = await FetchJSON<APIPages>(new Request(uri));
        return data.result.map(page => new Page(this, chapter, new URL(page.meta.source_url), { key: page.meta.drm_hash }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters.key) return data;

        const encrypted = await new Response(data).arrayBuffer();
        return this.decrypt(new Uint8Array(encrypted), page.Parameters.key as string);
    }

    private async decrypt(encrypted: Uint8Array, passphrase : string) : Promise<Blob>{
        const key = this.generateKey(passphrase);
        const decrypted = this.xor(encrypted, key);
        return Common.GetTypedData(decrypted);
    }

    private generateKey(t: string): Uint8Array {
        const e = t.slice(0, 16).match(/[\da-f]{2}/gi);
        if (null != e)
            return new Uint8Array(e.map(function (t) {
                return parseInt(t, 16);
            }));
        throw new Error("failed generate key.");
    }

    private xor(t: Uint8Array, e: Uint8Array) {
        const r = t.length;
        const i = e.length;
        const o = new Uint8Array(r);

        for (let a = 0; a < r; a += 1)
            o[a] = t[a] ^ e[a % i];
        return o;
    }
}
