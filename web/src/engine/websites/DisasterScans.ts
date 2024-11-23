import { Tags } from '../Tags';
import icon from './DisasterScans.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONChapter = {
    ChapterName: string,
    ChapterNumber: string,
    chapterID: number
}

function MangaExtractor(element: HTMLMetaElement) {
    return element.content.split('- Disaster Scans').at(0).trim();
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('div div h1').textContent.trim()
    };
}

function PageLinkExtractor(this: MangaScraper, image: HTMLImageElement): string {
    return new URL(image.getAttribute('src'), this.URI).searchParams.get('url') ?? image.getAttribute('src');
}

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'meta[property="og:title"]', MangaExtractor)
@Common.MangasSinglePageCSS('/comics', 'div.grid > a[href*="/comics/"]', MangaInfoExtractor)
@Common.PagesSinglePageCSS('section.container div img', PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private nextBuild = '';

    public constructor() {
        super('disasterscans', 'Disaster Scans', 'https://disasterscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${manga.Identifier}`, this.URI)), 'script:not([src])');
        const chapters = this.ExtractData<JSONChapter[]>(scripts, 'ChapterNumber', 'chapters');
        return chapters.map(chapter => {
            let title = `Chapter ${chapter.ChapterNumber}`;
            title += chapter.ChapterName ? ` - ${chapter.ChapterName}` : '';
            return new Chapter(this, manga, `${manga.Identifier}/${chapter.chapterID}-chapter-${chapter.ChapterNumber}`, title);
        });
    }

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
}