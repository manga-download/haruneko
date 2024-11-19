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

type JSONChapters = {
    chapters: {
        name: number
    }[]
}

type JSONPages = {
    pages: {
        url: string
    }[]
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
        const { chapters } = this.FindJSONObject<JSONChapters>(scripts, /is_early_access/, 'chapters');
        return chapters.map(chapter => new Chapter(this, manga, [manga.Identifier, 'chapter', chapter.name.toString()].join('/'), `Chapter ${chapter.name}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${chapter.Identifier}`, this.URI)), 'script:not([src])');
        const { pages } = this.FindJSONObject<JSONPages>(scripts, /chapterName/, 'pages');
        return pages
            .filter(page => excludes.none(pattern => pattern.test(page.url)))
            .map(page => new Page(this, chapter, new URL(page.url)));
    }

    private FindJSONObject<T>(scripts: HTMLScriptElement[], scriptRegex: RegExp, keyName: string, currentElement = undefined): T {

        if (scripts && scriptRegex) {
            const script = scripts.find(script => scriptRegex.test(script.text))?.text;
            if (!script) return undefined;
            //script are like self.__next_f.push([1,"
            const json = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2));// to remove trailing )]
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