import { Tags } from '../Tags';
import icon from './MechaComic.webp';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { AESDecrypt } from '../Crypto';

type ContentData = {
    images: Record<string, { src: string }[]>;
};

type PageParameters = {
    keyData?: string;
};

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const div = anchor.closest('div.p-chapterInfo');
    return {
        id: anchor.pathname,
        title: [
            div.querySelector('.p-chapterList_no').childNodes.item(0).textContent.trim(),
            div.querySelector('.p-chapterList_name').textContent.trim(),
        ].filter(entry => entry).join(' - ').trim()
    };
}

@Common.MangaCSS(/^{origin}\/books\/\d+$/, 'div.p-bookInfo_title h1')
@Common.MangasMultiPageCSS('div.p-book_detail dt.p-book_title a', Common.PatternLinkGenerator('/free/list?page={page}'))
@Common.ChaptersMultiPageCSS('ol.p-chapterList li div.p-chapterInfo a.p-btn-chapter:not([href*="register"])', Common.PatternLinkGenerator('{id}?page={page}'), 0, ChapterInfoExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mechacomic', 'MechaComic', 'https://mechacomic.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('_confirmed_adult', '1')`);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const response = await Fetch(new Request(new URL(chapter.Identifier, this.URI)));
        const params = new URL(response.url).searchParams;
        const baseURL = params.get('directory');
        const ver = params.get('ver');

        //fetch manifest to get key data
        const manifest = params.get('manifest_url');
        const { cryptokey } = await FetchJSON<{ cryptokey: string }>(new Request(new URL(manifest, this.URI)));
        const contentURI = new URL(params.get('contents') || params.get('contents_vertical') || params.get('contents_page'), response.url);
        contentURI.searchParams.set('ver', ver);
        const { images } = await FetchJSON<ContentData>(new Request(contentURI));

        return Object.values(images).map(srcset => {
            const uri = new URL(srcset.at(0).src, baseURL);
            uri.searchParams.set('ver', ver);
            return new Page<PageParameters>(this, chapter, uri, { keyData: cryptokey });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const bytes = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { signal }));
            return response.arrayBuffer();
        }, priority, signal);
        const { keyData } = page.Parameters;
        return Common.GetTypedData(await this.DecryptImage(bytes, keyData));
    }

    private async DecryptImage(encrypted: ArrayBuffer, keyData: string): Promise<ArrayBuffer> {
        const data = new Uint8Array(encrypted);
        return AESDecrypt(data.slice(16), GetBytesFromHex(keyData), { mode: 'CBC', iv: data.slice(0, 16) });
        /*const data = new Uint8Array(encrypted);
        const algorithm = { name: 'AES-CBC', iv: data.slice(0, 16) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromHex(keyData), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, data.slice(16));
        return decrypted;*/
    }
}