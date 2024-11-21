import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

const excludes = [
    /panda_gif_large/i,
    /2021\/04\/page100-10\.jpg/i,
    /2021\/03\/20-ending-page-\.jpg/i,
    /ENDING-PAGE/i,
    /EndDesignPSD/i
];

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.replace(/-[^-]+$/, '-'),
        title: anchor.querySelector('div.items-center span.font-bold').textContent.trim()
    };
}

type JSONChapter = {
    name: number
}

type JSONPage = {
    url: string;
}

@Common.MangasMultiPageCSS('/series?page={page}', 'div.grid a', 1, 1, 0, MangaInfoExtractor)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asuracomic.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), 'window.location.origin');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(this: DecoratableMangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
        const manga = await MangaStream.FetchMangaCSS.call(this, provider, url.replace(/-[^-]+$/, '-'), 'title');
        return new Manga(this, provider, manga.Identifier, manga.Title.replace(' - Asura Scans', '').trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${manga.Identifier}`, this.URI)), 'script:not([src])');
        const chapters = this.ExtractData<JSONChapter[]>(scripts, 'is_early_access', 'chapters');
        return chapters.map(chapter => new Chapter(this, manga, [manga.Identifier, 'chapter', chapter.name.toString()].join('/'), `Chapter ${chapter.name}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${chapter.Identifier}`, this.URI)), 'script:not([src])');
        const pages = this.ExtractData<JSONPage[]>(scripts, 'chapterName', 'pages');
        return pages
            .filter(page => excludes.none(pattern => pattern.test(page.url)))
            .map(page => new Page(this, chapter, new URL(page.url)));
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