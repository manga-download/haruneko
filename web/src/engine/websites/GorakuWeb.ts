import { Tags } from '../Tags';
import icon from './GorakuWeb.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';

type JSONMedia = Array<{
    href: string,
    title: string
}>;

type JSONPages = {
    accessKey: string,
    ivBytes: string,
    keyBytes: string,
    base: string,
    metadata: {
        pages: {
            filename: string
        }[]
    }
}

type PageParams = {
    keyBytes: string,
    ivBytes: string
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, 'meta[name="twitter:title"]')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gorakuweb', 'Goraku Web', 'https://gorakuweb.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL('/series', this.URI)), 'script:not([src])');
        const data = this.ExtractData<JSONMedia[]>(scripts, 'cardList', 'cardList');
        return data.reduce((accumulator: Manga[], array) => {
            const mangas = array.map(manga => new Manga(this, provider, new URL(manga.href, this.URI).pathname, manga.title.trim()));
            return accumulator.concat(mangas);
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(manga.Identifier, this.URI)), 'script:not([src])');
        const data = this.ExtractData<JSONMedia>(scripts, 'episodeList', 'episodeList');
        return data.map(chapter => new Chapter(this, manga, new URL(chapter.href, this.URI).pathname, chapter.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParams>[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(chapter.Identifier, this.URI)), 'script:not([src])');
        const { metadata: { pages }, accessKey, keyBytes, ivBytes, base } = this.ExtractData<JSONPages>(scripts, 'accessKey', 'metadata', true);
        return pages.map(page => new Page<PageParams>(this, chapter, new URL(`${base}/${page.filename}?__token__=${accessKey}`), {
            keyBytes, ivBytes
        }));
    }

    public override async FetchImage(page: Page<PageParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        if (!page.Parameters.keyBytes) return data;
        const decrypted = await this.DecryptPicture(new Uint8Array(await data.arrayBuffer()), page.Parameters);
        return Common.GetTypedData(decrypted);
    }

    private async DecryptPicture(encrypted: Uint8Array, page: PageParams): Promise<ArrayBuffer> {
        const secretKey = await crypto.subtle.importKey(
            'raw',
            GetBytesFromHex(page.keyBytes),
            {
                name: 'AES-CBC',
                length: 128
            }, true, [ 'decrypt']);

        return crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: GetBytesFromHex(page.ivBytes)
        }, secretKey, encrypted);
    }

    private ExtractData<T>(scripts: HTMLScriptElement[], scriptMatcher: string, keyName: string, asObject: boolean = false): T {
        const script = scripts.map(script => script.text).find(text => text.includes(scriptMatcher) && text.includes(keyName));
        const content = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2)) as string;
        const record = JSON.parse(content.substring(content.indexOf(':') + 1)) as JSONObject;

        return (function FindValueForKeyName(parent: JSONElement): JSONElement {
            if (parent[keyName]) {
                return asObject ? parent : parent[keyName];
            }
            for (const child of (Object.values(parent) as JSONElement[]).filter(value => value && typeof value === 'object')) {
                const result = FindValueForKeyName(child);
                if (result) {
                    return result;
                }
            }
            return undefined;
        })(record) as T;
    }

}