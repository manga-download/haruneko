import { Tags } from '../Tags';
import icon from './CoroCoro.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type JSONMangas = {
    weekdays: {
        mon: JSONManga[],
        tue: JSONManga[],
        wed: JSONManga[],
        thu: JSONManga[],
        fri: JSONManga[],
        sat: JSONManga[],
        sun: JSONManga[]
    }
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
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL('/rensai', this.URI)), 'script');
        const json = this.FindAndParseJSON(scripts, 'totalChapterLikes');
        const { weekdays: { mon, tue, wed, thu, fri, sat, sun } } = this.LocateObjectWithnNamedProperty<JSONMangas>(json, 'weekdays');
        return [mon, tue, wed, thu, fri, sat, sun].reduce((accumulator: Manga[], day) => {
            const mangas = day.map(manga => new Manga(this, provider, `/title/${manga.id}`, manga.name));
            accumulator.push(...mangas);
            return accumulator;
        }, []);

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${manga.Identifier}`, this.URI)), 'script');
        const json = this.FindAndParseJSON(scripts, 'omittedMiddleChapters');
        const { chapters: { earlyChapters, omittedMiddleChapters, latestChapters } } = this.LocateObjectWithnNamedProperty<JSONChapters>(json, 'chapters');
        return [earlyChapters, omittedMiddleChapters, latestChapters].reduce((accumulator: Chapter[], category) => {
            const chapters = category.map(chapter => new Chapter(this, manga, `/chapter/${chapter.id}`, chapter.title));
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<CryptoParams>[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${chapter.Identifier}`, this.URI)), 'script');
        const json = this.FindAndParseJSON(scripts, 'viewerSection');
        if (!json) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const { viewerSection: { pages } } = this.LocateObjectWithnNamedProperty<JSONPages>(json, 'viewerSection');
        return pages.map(page => new Page<CryptoParams>(this, chapter, new URL(page.src), page.crypto));
    }

    public override async FetchImage(page: Page<CryptoParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const cryptoParams = page.Parameters;
        if (!cryptoParams?.key) return blob;
        const encrypted = await blob.arrayBuffer();
        const cipher = { name: 'AES-CBC', iv: Buffer.from(cryptoParams.iv, 'hex') };
        const cryptoKey = await crypto.subtle.importKey('raw', Buffer.from(cryptoParams.key, 'hex'), cipher, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(cipher, cryptoKey, encrypted);
        return Common.GetTypedData(decrypted);
    }

    private FindAndParseJSON(scripts: HTMLScriptElement[], textToFind: string): JSONObject {
        const script = scripts.find(script => script.innerText.indexOf(textToFind) > 0)?.innerText;
        if (!script) return undefined;
        const json = JSON.parse(script.substring(22, script.length - 2));
        return JSON.parse(json.substring(json.indexOf(':') + 1));
    }

    private LocateObjectWithnNamedProperty<T>(obj, keyname: string): T {
        if (!obj) return null;
        if (obj[keyname]) {
            return obj as T;
        }
        let result = null;
        for (let i in obj) {
            if (typeof obj[i] === 'object')
                result = result ?? this.LocateObjectWithnNamedProperty(obj[i], keyname);
        }
        return result;
    }

}
