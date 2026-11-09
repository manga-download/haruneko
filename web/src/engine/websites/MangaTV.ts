import { Tags } from '../Tags';
import icon from './MangaTV.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { RandomText } from '../Random';
import { FetchWindowPreloadScript } from '../platform/FetchProvider';

type PagesData = {
    p: string[];
    s?: number[];
};

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a.dload').pathname,
        title: [...element.querySelectorAll('.chapternum')].map(({ textContent }) => textContent.trim()).join(' ').trim()
    };
};

@MangaStream.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/)
@Common.MangasMultiPageCSS('div.listupd div.bsx a', Common.PatternLinkGenerator('/lista?page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapterlist ul li div.chbox', undefined, ChapterExtractor)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatv', 'MangaTV', 'https://mangatv.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
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
                        if (result.p && Array.isArray(result.p)){
                            setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                        }
                    } catch {}
                    return result;
                }
            });
        `;

        const { p, s } = await FetchWindowPreloadScript<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), PagePreloadScript, PageScript);
        return p
            .filter((_, index) => !s.includes(index))
            .map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }

}