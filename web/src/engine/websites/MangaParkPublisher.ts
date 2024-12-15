import { Tags } from '../Tags';
import icon from './MangaParkPublisher.webp';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIPages = {
    data: {
        chapter: {
            images: {
                path: string,
                key: string
            }[]
        }[]
    }
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('div.info h3').textContent.trim()
    };
}

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.dataset.chapterId,
        title: element.querySelector('.chapterTitle').textContent.trim(),
    };
}

const endpoints = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'end'].map(segment => `/series/${segment}`);

@Common.MangaCSS(/^{origin}\/title\/\d+$/, 'div.titleMain div.titleInfo h1')
@Common.MangasSinglePagesCSS(endpoints, 'div.list div.series ul.common-list li a', MangaExtractor)
@Common.ChaptersSinglePageCSS('div.chapter ul li[data-chapter-id]', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-park', `マンガPark (Manga-Park)`, 'https://manga-park.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/api/chapter/${chapter.Identifier}`, this.URI));
        const { data } = await FetchJSON<APIPages>(request);
        return data.chapter.map(page => new Page(this, chapter, new URL(page.images[0].path), { key: page.images[0].key }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        const encrypted = await data.arrayBuffer();
        const decrypted = this.DecryptImage(new Uint8Array(encrypted), page.Parameters.key as string);
        return Common.GetTypedData(decrypted);
    }

    private DecryptImage(sourceArray: Uint8Array, key: string) {
        const e = window.atob(key).split('').map(s => s.charCodeAt(0));
        const r = sourceArray.length;
        const i = e.length;
        const o = new Uint8Array(r);

        for (let a = 0; a < r; a += 1) {
            o[a] = sourceArray[a] ^ e[a % i];
        }
        return o.buffer;
    }
}