import { type Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { Fetch, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import type { Priority } from '../../taskpool/DeferredTask';

export type APIResult = {
    mes: string;
};

type ZingParams = {
    nonce: string,
    apiURL: string,
};

type PageParameters = {
    sp: string,
    chapterID: string,
    imageIndex: number,
};

export function CleanTitle(title: string): string {
    return title.replace(/\(Raw.*Free\)/i, '').trim();
}

export function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.querySelector<HTMLSpanElement>('span')?.textContent ?? anchor.text)
    };
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.text)
    };
}

@Common.MangaCSS(/^{origin}\/manga(-raw)?\/[^/]+\/$/, 'div.container h1.name', (element) => CleanTitle(element.textContent))
@Common.MangasMultiPageCSS('div.grid-of-mangas h2.name a', Common.PatternLinkGenerator('/page/{page}/'), 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.chapter-box a', undefined, ChapterExtractor)
export class Zing92Base extends DecoratableMangaScraper {

    protected zingParams: ZingParams;
    protected zingParamsScript = 'new Promise(resolve => resolve({ nonce: zing.nonce, apiURL: zing.ajax_url }));';
    protected decodeImageAjaxAction = 'decode_images';
    protected nonceParameterName = 'nonce';

    public override async Initialize(): Promise<void> {
        this.zingParams = await FetchWindowScript(new Request(this.URI), this.zingParamsScript, 500);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const data = await (await Fetch(new Request(new URL(chapter.Identifier, this.URI)))).text();
        const sp = data.match(/\sp:\s*(\d+),/).at(-1);
        const chapterID = data.match(/chapter_id\s*:\s*['"]([^'"]+)/).at(-1);
        const possibleLinks = new Array(256).fill(0).map((_, imageIndex) => new Page<PageParameters>(this, chapter, this.URI, { sp, chapterID, imageIndex }));
        return possibleLinks.takeUntil(async page => this.FetchZingPage(page.Parameters).then(data => data.includes('<img')));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const data = await this.FetchZingPage(page.Parameters);
            const link = new DOMParser().parseFromString(data, 'text/html').documentElement.querySelector('img')?.src;
            return Fetch(new Request(link)).then(response => response.arrayBuffer()).then(data => Common.GetTypedData(data));
        }, priority, signal);
    }

    private async FetchZingPage(params: PageParameters): Promise<string> {
        const { mes } = await FetchJSON<APIResult>(new Request(new URL(this.zingParams.apiURL, this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                [this.nonceParameterName]: this.zingParams.nonce,
                action: 'z_do_ajax',
                _action: this.decodeImageAjaxAction,
                p: params.sp,
                img_index: `${params.imageIndex}`,
                chapter_id: params.chapterID,
                content: ''
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF8',
                'X-Requested-With': 'XMLHttpRequest',
            }
        }));
        return mes;
    }
}