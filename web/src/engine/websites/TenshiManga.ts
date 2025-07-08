import { Tags } from '../Tags';
import icon from './TenshiManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONPage = {
    path: string
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('h3.chapternum').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.content-info img', (element) => element.getAttribute('alt').trim())
@Common.MangasMultiPageCSS('search?page={page}', 'section[aria-label*="series"] div.card > div a:has(h2)')
@Common.ChaptersSinglePageCSS('div.list-episode a', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly cdnUrl = 'https://cdn1.tenshimanga.com/upload/series/';

    public constructor() {
        super('tenshimanga', 'Tenshi Manga', 'https://tenshimanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`${chapter.Identifier}`, this.URI)), 'script:not([src])');
        const pages = this.ExtractData<JSONPage[]>(scripts, 'series_items', 'series_items');
        return pages.map(page => new Page(this, chapter, new URL(page.path, this.cdnUrl)));
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