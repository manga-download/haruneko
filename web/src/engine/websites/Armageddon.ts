import { Tags } from '../Tags';
import icon from './Armageddon.webp';
import { DecoratableMangaScraper, Page, type Chapter } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { RandomText } from '../Random';
import { FetchWindowPreloadScript } from '../platform/FetchProvider';

function PageScript(eventName: string): string {
    return `
        new Promise( resolve => {
            window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
        });
    `;
};

function PagePreloadScript(eventName: string): string {
    return `
        JSON.parse = new Proxy(JSON.parse, {
            apply(target, thisArg, args) {
                const result = Reflect.apply(target, thisArg, args);
                try {
                    if (Array.isArray(result) && result[0].startsWith('http')) {
                        setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                    }
                } catch {}
                return result;
            }
        });
    `;
};

@MangaStream.MangaCSS(/^{origin}\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('armageddon', 'Armageddon', 'https://www.silentquill.net', Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const eventName = RandomText(32);
        const pages = await FetchWindowPreloadScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), PagePreloadScript(eventName), PageScript(eventName));
        return pages.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }
}