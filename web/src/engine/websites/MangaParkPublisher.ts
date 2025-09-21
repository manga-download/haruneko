import { Tags } from '../Tags';
import icon from './MangaParkPublisher.webp';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromBase64 } from '../BufferEncoder';

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

type PageParameters = {
    key: string;
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
@Common.ChaptersSinglePageCSS('div.chapter ul li[data-chapter-id]', undefined, ChapterExtractor)
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
        return data.chapter.map(page => new Page<PageParameters>(this, chapter, new URL(page.images[0].path), { key: page.images[0].key }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        const decrypted = this.DecryptImage(await data.arrayBuffer(), page.Parameters.key);
        return Common.GetTypedData(decrypted);
    }

    private DecryptImage(encrypted: ArrayBuffer, passphrase: string): ArrayBuffer {
        const key = GetBytesFromBase64(passphrase);
        return new Uint8Array(encrypted).map((byte, index) => byte ^ key[index % key.length]).buffer;
    }
}