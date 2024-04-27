import { Tags } from '../Tags';
import icon from './MangaParkPublisher.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
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
    const num = element.querySelector('div.chapterNumber span').textContent.trim();
    const title = element.querySelector('div.chapterNumber p.chapterTitle').textContent.trim();
    return {
        id: element.dataset.chapterId,
        title: (num + ' - ' + title).trim(),
    };
}

@Common.MangaCSS(/^{origin}\/title\/\d+$/, 'div.titleMain div.titleInfo h1')
@Common.ChaptersSinglePageCSS('div.chapter ul li[data-chapter-id]', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-park', `マンガPark (Manga-Park)`, 'https://manga-park.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist : Manga[] = [];
        const paths = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'end'];
        for (const path of paths) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, `/series/${path}`, 'div.list div.series ul.common-list li a', MangaExtractor);
            mangalist.push(...mangas);
        }
        return mangalist;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/api/chapter/${chapter.Identifier}`, this.URI).href);
        const { data } = await FetchJSON<APIPages>(request);
        return data.chapter.map(page => new Page(this, chapter, new URL(page.images[0].path), { key: page.images[0].key }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        const encrypted = await data.arrayBuffer();
        const decrypted = this.Xor(new Uint8Array(encrypted), page.Parameters.key as string);
        return Common.GetTypedData(decrypted);
    }

    private Xor(t: Uint8Array, key: string) {
        const e = window.atob(key).split('').map(s => s.charCodeAt(0));
        const r = t.length;
        const i = e.length;
        const o = new Uint8Array(r);

        for (let a = 0; a < r; a += 1)
            o[a] = t[a] ^ e[a % i];
        return o;
    }
}