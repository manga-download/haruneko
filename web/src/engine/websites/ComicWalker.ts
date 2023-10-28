import { Tags } from '../Tags';
import icon from './ComicWalker.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchJSON, FetchRequest } from '../FetchProvider';
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

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.title.trim()
    };
}

@Common.MangaCSS(/^https?:\/\/comic-walker\.com\/contents\/detail\/[^/]+\/$/, 'div#mainContent div#detailIndex div.comicIndex-box h1')
@Common.ChaptersSinglePageCSS('div#ulreversible ul#reversible li a', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicwalker', `コミックウォーカー (ComicWalker)`, 'https://comic-walker.com', Tags.Language.Multilingual, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList : Manga[] = [];
        for (const language of ['en', 'tw', 'jp']) {
            await this.setLanguage(language);
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, '/contents/list/p?={page}', 'div.comicPage ul.tileList li a', 1, 1, 0, Common.AnchorInfoExtractor(false, '.contents_tile_epi'));
            mangasList.push(...mangas);
        }
        return mangasList;
    }

    private async setLanguage(language: string): Promise<void> {
        const request = new FetchRequest(`${this.URI.origin}/set_lang/${ language }/`);
        await Fetch(request);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //get endpoints data
        const request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        const mainApp = await FetchCSS(request, 'main#app');
        const endpoints: string | TEndpoints = mainApp[0].dataset.apiEndpointUrl ? mainApp[0].dataset.apiEndpointUrl : JSON.parse(mainApp[0].dataset.apiEndpointUrls);
        const uri = `${(endpoints as TEndpoints).nc || (endpoints as TEndpoints).cw || endpoints}/api/v1/comicwalker/episodes/${mainApp[0].dataset.episodeId}/frames`;

        const { data } = await FetchJSON<APIPages>(new FetchRequest(uri));
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

    /**
     ******************************
     * ** COMIC-WALKER CODE BEGIN ***
     *****************************
     */

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

    /**
     ****************************
     * ** COMIC-WALKER CODE END ***
     ***************************
     */
}
