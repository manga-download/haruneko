import { type Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { Fetch, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';

export type APIResult = {
    mes: string;
    img_index: number;
    going: 1 | 0 | 'yes' | 'no';
};

type ZingParams = {
    nonce: string;
    apiURL: string;
};

type PageParameters = {
    chapterID: string;
    imageIndex: number;
};

export function CleanTitle(title: string): string {
    return title.replace(/\(?Raw.*Free\)?/i, '').trim();
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

@Common.MangaCSS(/^{origin}\/manga(-raw)?\/[^/]+\/$/, 'div.container h1.name', (element, uri) => ({ id: uri.pathname, title: CleanTitle(element.textContent) }))
@Common.MangasMultiPageCSS('div.grid-of-mangas h2.name a', Common.PatternLinkGenerator('/page/{page}/'), 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.chapter-box a', undefined, ChapterExtractor)
@Common.ImageAjax(true)
export class Zing92Base extends DecoratableMangaScraper {

    protected zingParams: ZingParams;
    private nonceParameterName = 'nonce';
    private chapterParameterName = 'reading_chapter';

    public override async Initialize(): Promise<void> {
        this.zingParams = await FetchWindowScript(new Request(this.URI), `new Promise(resolve => resolve({ nonce: zing['${this.nonceParameterName}'], apiURL: zing.ajax_url }));`, 500);
    }

    protected WithNonceName(nonce: string): this {
        this.nonceParameterName = nonce;
        return this;
    }

    protected WithChapterParameterName(paramName: string): this {
        this.chapterParameterName = paramName;
        return this;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const data = await (await Fetch(new Request(new URL(chapter.Identifier, this.URI)))).text();
        const chapterID = data.match(/\sp:\s*(\d+),/)?.at(-1) ?? data.match(/\sreading_chapter:\s*(\d+),/)?.at(-1);
        const pagesList = [];
        //On new chapters, there is only one AjAX request. On older there are only two, i'd say 3 max.
        for (let imageIndex = 0, run = true; run;) {
            const { mes, going, img_index } = await this.FetchZingPage({ chapterID, imageIndex });
            const links = [...new DOMParser().parseFromString(mes, 'text/html').documentElement.querySelectorAll('img')];
            links.length > 0 && pagesList.push(...links.map(img => new Page(this, chapter, new URL(img.src))));
            run = going === 1;
            imageIndex = img_index;
        }
        return pagesList;
    }

    private async FetchZingPage(params: PageParameters): Promise<APIResult> {
        return await FetchJSON<APIResult>(new Request(new URL(this.zingParams.apiURL, this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                ... this.nonceParameterName && { [this.nonceParameterName]: this.zingParams.nonce },
                action: 'z_do_ajax',
                _action: 'decode_images',
                [this.chapterParameterName]: params.chapterID,
                img_index: `${params.imageIndex}`,
                content: ''
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF8',
                'X-Requested-With': 'XMLHttpRequest',
            }
        }));
    }
}