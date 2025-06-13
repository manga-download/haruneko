import { Tags } from '../Tags';
import icon from './KLMangash.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type ZingParams = {
    nonce: string,
    ajax_url: string
}

type PageResult = {
    mes: string,
    going: number,
    img_index: number
}

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
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private zingParams: ZingParams;

    public constructor() {
        super('klmangash', 'KLManga(.sh)', 'https://klmanga.de', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.zingParams = await FetchWindowScript(new Request(this.URI), 'new Promise (resolve => resolve({ nonce: zing.nonce_a, ajax_url : zing.ajax_url }));', 500);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages: Page[] = [];
        const doc = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        const params = new URLSearchParams({
            nonce_a: this.zingParams.nonce,
            action: 'z_do_ajax',
            _action: 'decode_images_100',
            p: doc.documentElement.innerHTML.match(/\sp:\s*(\d+),/).at(1),
            img_index: '0',
            chapter_id: doc.documentElement.innerHTML.match(/chapter_id\s*:\s*['"]([^'"]+)/).at(1),
            content: ''
        });

        for (let run = true; run;) {
            const request = new Request(this.zingParams.ajax_url, {
                method: 'POST',
                body: params,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF8',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            let { img_index, mes, going } = await FetchJSON<PageResult>(request);
            run = going === 1;
            params.set('img_index', img_index.toString());
            pages.push(...[...new DOMParser().parseFromString(mes, 'text/html').documentElement.querySelectorAll<HTMLImageElement>('img')].map(page => new Page(this, chapter, new URL(page.src))));
        }
        return pages;
    }
}
