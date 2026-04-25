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
                path: string;
                key: string;
            }[]
        }[]
    }
};

type PageParameters = {
    key: string;
};

const endpoints = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'end'].map(segment => `/series/${segment}`);

@Common.MangaCSS(/^{origin}\/title\/\d+$/, 'div.titleMain div.titleInfo h1')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.list div.series ul.common-list li a', Common.StaticLinkGenerator(...endpoints), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector('div.info h3').textContent.trim() }))
@Common.ChaptersSinglePageCSS('div.chapter ul li[data-chapter-id]', undefined,
    element => ({ id: element.dataset.chapterId, title: element.querySelector('.chapterTitle').textContent.trim() }))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-park', `マンガPark (Manga-Park)`, 'https://manga-park.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: chapterData } } = await FetchJSON<APIPages>(new Request(new URL(`/api/chapter/${chapter.Identifier}`, this.URI)));
        return chapterData.map(({ images }) => new Page<PageParameters>(this, chapter, new URL(images[0].path), { key: images[0].key }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const decrypted = this.DecryptImage(await blob.arrayBuffer(), GetBytesFromBase64(page.Parameters.key));
        return Common.GetTypedData(decrypted);
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        // All chapters have the same url
        return new URL(`/title/${chapter.Parent.Identifier}`, this.URI);
    }

    private DecryptImage(encrypted: ArrayBuffer, key: Uint8Array): ArrayBuffer {
        return new Uint8Array(encrypted).map((byte, index) => byte ^ key[index % key.length]).buffer;
    }
}