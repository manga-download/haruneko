import { Tags } from '../Tags';
import icon from './LunarAnimes.webp';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';
import { RandomText } from '../Random';

type APIMangas = {
    manga: APIManga[];
};

type APIManga = {
    title: string;
    slug: string;
};

type APIChapters = {
    data: {
        chapter_number: number;
        language: string;
    }[]
};

const chapterLanguageMap = new Map([
    ['zh', Tags.Language.Chinese],
    ['en', Tags.Language.English],
    ['id', Tags.Language.Indonesian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    ['pl', Tags.Language.Polish],
    ['pt', Tags.Language.Portuguese],
    ['ru', Tags.Language.Russian],
    ['es', Tags.Language.Spanish],
    ['th', Tags.Language.Thai],
    ['tr', Tags.Language.Turkish],
    ['vi', Tags.Language.Vietnamese],
]);

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.content.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.lunaranime.ru/api/manga/';

    public constructor() {
        super('lunaranimes', 'Lunar Animes', 'https://lunaranime.ru', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { manga } = await FetchJSON<APIMangas>(new Request(new URL(`./search?page=${page}&limit=100&sort=relevance`, this.apiUrl)));
                const mangas = manga.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIChapters>(new Request(new URL(`./${manga.Identifier}`, this.apiUrl)));
        return data.map(({ chapter_number: chapterNumber, language }) => {
            return new Chapter(this, manga, `/manga/${manga.Identifier}/${chapterNumber}?lang=${language}`, `Chapter ${chapterNumber} (${language})`,
                ...chapterLanguageMap.has(language) ? [chapterLanguageMap.get(language)] : []);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const eventName = RandomText(32);
        const PageScript = `
            new Promise( resolve => {
                    window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
            });
        `;

        const PagePreloadScript = `
            JSON.parse = new Proxy(JSON.parse, {
                apply(target, thisArg, args) {
                    const result = Reflect.apply(target, thisArg, args);
                    try{
                        if (result.data?.images){
                            setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result.data.images })), 250);
                        }
                    } catch {}
                    return result;
                }
            });
        `;

        const data = await FetchWindowPreloadScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), PagePreloadScript, PageScript);
        return data.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }

    private async Decrypt<T extends JSONElement>(data: string, secretKey: string): Promise<T> {
        const keyData = await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(secretKey));
        const algorithm = { name: 'AES-CBC', iv: new Uint8Array(16) };
        const key = await crypto.subtle.importKey('raw', keyData, algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, GetBytesFromBase64(data));
        return JSON.parse(GetUTF8FromBytes(decrypted)) as T;
    }

}