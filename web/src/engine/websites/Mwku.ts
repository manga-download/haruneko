import { Tags } from '../Tags';
import icon from './Mwku.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromUTF8 } from '../BufferEncoder';
import { GetTypedData } from './decorators/Common';
import { DecryptAES } from '../Crypto';

type APIPages = {
    data: {
        images: {
            url: string;
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/comic\/\d+$/, 'h2#page-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#dataList div.item a', Common.PatternLinkGenerator('/cate/{page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLDivElement>('div.title').textContent.trim() }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('#chapter-grid-container > a.chapter-item', undefined,
    anchor => ({ id: anchor.pathname, title: anchor.dataset.title.trim() }))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mwku', 'Mwku', 'https://manwari.cc', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin;`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //some chapters got different lazy loading, some are multipaged. Using API for reliabillity;
        const CDN = await FetchWindowScript<string>(new Request(new URL(chapter.Identifier, this.URI)), 'CURRENT_IMAGE_SOURCE', 1500);
        const { data: { images } } = await FetchJSON<APIPages>(new Request(new URL(`./api/comic/image/${chapter.Identifier.split('/').at(-1)}?page=1&page_size=9999&image_source=${encodeURIComponent(CDN)}`, this.URI)));
        return images.map(({ url }) => new Page(this, chapter, new URL(url, CDN)));
    };

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        if (blob.type.startsWith('image')) return blob;
        const buffer = await blob.arrayBuffer();
        return GetTypedData(await DecryptAES(buffer.slice(16), GetBytesFromUTF8('0B6666A0-BB59-1381-B746-a0E4C9AC').slice(0, 32), { name: 'AES-CBC', iv: buffer.slice(0, 16) }));
    }
}