import { Tags } from '../Tags';
import icon from './KLMangash.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type ZingParams = {
    nonce: string,
    apiURL: string,
};

type PageParameters = {
    sp: string,
    chapterID: string,
    imageIndex: number,
};

function CleanTitle(title: string): string {
    return title.replace(/\(Raw.*Free\)/i, '').trim();
}

function MangaLabelExtractor(element: HTMLHeadingElement): string {
    return CleanTitle(element.textContent);
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.text)
    };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.querySelector<HTMLSpanElement>('span').textContent)
    };
}

@Common.MangaCSS(/^{origin}\/manga-raw\/[^/]+\/$/, 'div.container div.z-single-mg h1.name', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/page/{page}/', 'div.grid-of-mangas h2.name a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.chapter-box a', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    private zingParams: ZingParams;

    public constructor () {
        super('klmangash', 'KLManga(.sh)', 'https://klmanga.st', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.zingParams = await FetchWindowScript(new Request(this.URI), `new Promise(resolve => resolve({ nonce: zing.nonce_a, apiURL: zing.ajax_url }));`, 500);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const data = await (await Fetch(new Request(new URL(chapter.Identifier, this.URI)))).text();
        const sp = data.match(/\sp:\s*(\d+),/).at(-1);
        const chapterID = data.match(/chapter_id\s*:\s*['"]([^'"]+)/).at(-1);
        const possibleLinks = new Array(256).fill(0).map((_, imageIndex) => new Page<PageParameters>(this, chapter, this.URI, { sp, chapterID, imageIndex }));
        return possibleLinks.takeUntil(async page => this.FetchZingPage(page.Parameters).then(data => data.includes('<img')));
        // TODO: After running E2E test for specific chapter, the website will only provide the last 2 images (could this be a flagged IP address?)
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const data = await this.FetchZingPage(page.Parameters);
            const link = new DOMParser().parseFromString(data, 'text/html').documentElement.querySelector('img')?.src;
            return Fetch(new Request(link)).then(response => response.arrayBuffer()).then(data => Common.GetTypedData(data));
        }, priority, signal);
    }

    private async FetchZingPage(params: PageParameters): Promise<string> {
        const { mes } = await FetchJSON<{ mes: string; }>(new Request(this.zingParams.apiURL, {
            method: 'POST',
            body: new URLSearchParams({
                nonce_a: this.zingParams.nonce,
                action: 'z_do_ajax',
                _action: 'decode_images_g',
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