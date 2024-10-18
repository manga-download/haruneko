import { Tags } from '../Tags';
import icon from './CoroCoro.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type JSONMangas = {
    weekdays: Record<string, JSONManga[]>;
}

type JSONManga = {
    id: number,
    name: string
}

type JSONChapters = {
    chapters: {
        earlyChapters: JSONChapter[],
        omittedMiddleChapters: JSONChapter[],
        latestChapters: JSONChapter[]
    }
}

type JSONChapter = {
    id: number,
    title: string
}

type JSONPages = {
    viewerSection: {
        pages: {
            src: string,
            crypto: CryptoParams
        }[]
    }
}

type CryptoParams = {
    iv: string,
    key: string,
    method: string
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
        const { weekdays } = this.FindJSONObject<JSONMangas>(scripts, /totalChapterLikes/, 'weekdays');
        return Object.values(weekdays).reduce((accumulator: Manga[], day) => {
            const mangas = day.map(manga => new Manga(this, provider, `/title/${manga.id}`, manga.name));
            accumulator.push(...mangas);
            return accumulator;
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${manga.Identifier}`, this.URI)), 'script:not([src])');
        const { chapters: { earlyChapters, omittedMiddleChapters, latestChapters } } = this.FindJSONObject<JSONChapters>(scripts, /omittedMiddleChapters/, 'chapters');
        return [earlyChapters, omittedMiddleChapters, latestChapters].reduce((accumulator: Chapter[], category) => {
            const chapters = category.map(chapter => new Chapter(this, manga, `/chapter/${chapter.id}`, chapter.title));
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<CryptoParams>[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${chapter.Identifier}`, this.URI)), 'script:not([src])');
        const jsonPages = this.FindJSONObject<JSONPages>(scripts, /viewerSection/, 'viewerSection');
        if (!jsonPages) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return jsonPages.viewerSection.pages.map(page => new Page<CryptoParams>(this, chapter, new URL(page.src), page.crypto));
    }

    public override async FetchImage(page: Page<CryptoParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const cryptoParams = page.Parameters;
        switch (cryptoParams.method) {
            case 'aes-cbc': {
                const encrypted = await blob.arrayBuffer();
                const cipher = { name: 'AES-CBC', iv: Buffer.from(cryptoParams.iv, 'hex') };
                const cryptoKey = await crypto.subtle.importKey('raw', Buffer.from(cryptoParams.key, 'hex'), cipher, false, ['decrypt']);
                const decrypted = await crypto.subtle.decrypt(cipher, cryptoKey, encrypted);
                return Common.GetTypedData(decrypted);
            }
            default: return blob;
        }
    }

    private FindJSONObject<T>(scripts: HTMLScriptElement[], scriptRegex: RegExp, keyName: string, currentElement = undefined): T {

        if (scripts && scriptRegex) {
            const script = scripts.find(script => scriptRegex.test(script.text))?.text;
            if (!script) return undefined;
            const json = JSON.parse(script.substring(22, script.length - 2));
            currentElement = JSON.parse(json.substring(json.indexOf(':') + 1));
            return this.FindJSONObject<T>(undefined, undefined, keyName, currentElement);
        }

        if (!currentElement) return undefined;
        if (currentElement[keyName]) {
            return currentElement;
        }
        let result = undefined;
        for (let i in currentElement) {
            if (result) break;
            if (typeof currentElement[i] === 'object')
                result = result ?? this.FindJSONObject<T>(undefined, undefined, keyName, currentElement[i]);
        }
        return result as T;
    }
}
