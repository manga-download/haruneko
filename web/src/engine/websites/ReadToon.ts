import { Tags } from '../Tags';
import icon from './ReadToon.webp';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { type Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { RandomText } from '../Random';

type APIChapter = {
    no: number;
    name: string;
};

type PagesData = {
    base: string;
    result: string[];
};

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
                if (result.base && result.type && result.result){
                    setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                }
                return result;
            }
        });
    `;
};

@Common.MangaCSS(/^{origin}\/content\/[^/]+$/, 'nav ol li:last-of-type', (el, uri) => ({ id: uri.href.split('/').at(-1), title: el.textContent.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a[href*="/content/"]:has(h3)', Common.PatternLinkGenerator('/discover?page={page}'), 0, anchor => ({ id: anchor.pathname.split('/').at(-1), title: anchor.text.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://visa.readtoon.com/api/';

    public constructor() {
        super('readtoon', 'ReadToon', 'https://readtoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapter[]>(`./content/${manga.Identifier}/chapters`);
        return chapters.map(({ no, name }) => new Chapter(this, manga, `./content/${manga.Identifier}/${no}`, name || `ตอนที่ ${no}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const eventName = RandomText(32);
        const { base, result } = await FetchWindowPreloadScript<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), PagePreloadScript(eventName), PageScript(eventName));
        return result.map(image => new Page(this, chapter, new URL([base, image].join('/'))));
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        }));
    }
}