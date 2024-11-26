import { Tags } from '../Tags';
import icon from './CoroCoro.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { FromHexString } from '../BufferEncoder';

type JSONManga = {
    id: number;
    name: string;
}

type JSONMangas = Record<string, JSONManga[]>;

type JSONChapter = {
    id: number;
    title: string;
}

type JSONChapters = Record<string, JSONChapter[]>;

type JSONPages = {
    pages: {
        src: string;
        crypto: CryptoParams;
    }[];
}

type CryptoParams = {
    iv: string;
    key: string;
    method: string;
}

@Common.MangaCSS(/^{origin}\/title\/\d+$/, 'main > div > div > section > div.grid > h1.font-bold')

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('corocoro', `CoroCoro Online (コロコロオンライン)`, 'https://www.corocoro.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL('/rensai', this.URI)), 'script:not([src])');
        const mangaCollection = this.ExtractData<JSONMangas>(scripts, 'totalChapterLikes', 'weekdays');
        return Object.values(mangaCollection).reduce((accumulator: Manga[], collection) => {
            const mangas = collection.map(manga => new Manga(this, provider, `/title/${manga.id}`, manga.name));
            return [...accumulator, ...mangas];
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${manga.Identifier}`, this.URI)), 'script:not([src])');
        const chapterCollection = this.ExtractData<JSONChapters>(scripts, 'omittedMiddleChapters', 'chapters');
        return Object.values(chapterCollection).reduce((accumulator: Chapter[], collection) => {
            const chapters = collection.map(chapter => new Chapter(this, manga, `/chapter/${chapter.id}`, chapter.title));
            return [...accumulator, ...chapters];
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<CryptoParams>[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${chapter.Identifier}`, this.URI)), 'script:not([src])');
        const viewerSection = this.ExtractData<JSONPages>(scripts, 'viewerSection', 'viewerSection');
        return viewerSection.pages.map(page => new Page<CryptoParams>(this, chapter, new URL(page.src), page.crypto));
    }

    public override async FetchImage(page: Page<CryptoParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const cryptoParams = page.Parameters;
        switch (cryptoParams.method) {
            case 'aes-cbc': {
                const encrypted = await blob.arrayBuffer();
                const cipher = { name: 'AES-CBC', iv: FromHexString(cryptoParams.iv) };
                const cryptoKey = await crypto.subtle.importKey('raw', FromHexString(cryptoParams.key), cipher, false, ['decrypt']);
                const decrypted = await crypto.subtle.decrypt(cipher, cryptoKey, encrypted);
                return Common.GetTypedData(decrypted);
            }
            default: return blob;
        }
    }

    private ExtractData<T>(scripts: HTMLScriptElement[], scriptMatcher: string, keyName: string): T {
        const script = scripts.map(script => script.text).find(text => text.includes(scriptMatcher) && text.includes(keyName));
        const content = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2)) as string;
        let record = JSON.parse(content.substring(content.indexOf(':') + 1)) as JSONObject;

        return (function FindValueForKeyName(parent: JSONElement): JSONElement {
            if (parent[keyName]) {
                return parent[keyName];
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