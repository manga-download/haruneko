import { Tags } from '../Tags';
import icon from './PoseidonScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T
}
type APIManga = {
    title: string,
    slug: string,
    chapters: APIChapter[]
}

type APIChapter = {
    number: number,
}

type JSONPage = {
    originalUrl: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://poseidonscans.fr/api/';

    public constructor() {
        super('poseidonscans', 'Poseidon Scans', 'https://poseidonscans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/serie/[^/]+$`).test(url);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL('/series', this.URI)), 'script:not([src])');
        const mangas = this.ExtractData<APIManga[]>(scripts, 'mangas\\', 'mangas');
        return mangas.map(manga => new Manga(this, provider, manga.slug, manga.title));
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaSlug = url.split('/').at(-1);
        const { data: { title, slug } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./manga/${mangaSlug}`, this.apiUrl)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(chapter => new Chapter(this, manga, `/serie/${manga.Identifier}/chapter/${chapter.number}`, `Chapitre ${chapter.number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(chapter.Identifier, this.URI)), 'script:not([src])');
        const images = this.ExtractData<JSONPage[]>(scripts, 'images\\', 'images');
        return images.map(image => new Page(this, chapter, new URL(image.originalUrl, this.URI)));
    }

    /*
    private ExtractData<T>(scripts: HTMLScriptElement[], scriptMatcher: string, keyName: string): T {
        const script = scripts.map(script => script.text).find(text => text.includes(scriptMatcher) && text.includes(keyName));
        const content = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2)) as string;
        const record = JSON.parse(content.substring(content.indexOf(':') + 1)) as JSONObject;

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
    */
}