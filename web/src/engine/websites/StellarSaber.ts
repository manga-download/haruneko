import { Tags } from '../Tags';
import icon from './StellarSaber.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromBase64 } from '../BufferEncoder';
import { GetTypedData } from './decorators/Common';
import { DecryptAES } from '../Crypto';

type JSONChapter = {
    team: string;
    url: string;
    title: string;
};

type PagesData = {
    images: string[];
    nonce: string;
    chapterId: number;
};

type KeyData = {
    key: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.detail-info__title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.archive-main div.card-grid a.card', Common.PatternLinkGenerator('/manga/page/{page}/'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('img').alt.trim()
}))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('stellarsaber', 'Stellar Saber', 'https://stellarsaber.pro', Tags.Media.Manga, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const elements = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'a.chapter-item, div.chapter-item--multi');
        return elements.flatMap(element => {
            if (element instanceof HTMLAnchorElement) {
                return new Chapter(this, manga, element.pathname, element.querySelector('.chapter-item__title').textContent.trim());
            }

            if (element.dataset.versions) {
                const data = <JSONChapter[]>JSON.parse(element.dataset.versions);
                return data.map(({ team, url, title }) => new Chapter(this, manga, new URL(url).pathname, [title, team].joinTitleSegments()));
            }
            return [];
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<KeyData>[]> {
        const { nonce, images, chapterId } = await FetchWindowScript<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise( resolve => {
                const images = [...document.querySelectorAll('img[data-cdn-url]')].map(el=> el.dataset.cdnUrl);
                resolve( { images, nonce : flavorReaderData.cdnNonce, chapterId : flavorReaderData.chapterId });
            })
        `, 1000);
        const { data: { key } } = await FetchJSON<{ data: { key: string; } }>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'flavor_cdn_get_key',
                nonce,
                chapter_id: `${chapterId}`
            }).toString()
        }));
        return images.map(page => new Page<KeyData>(this, chapter, new URL(page, this.URI), { key, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<KeyData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const arrayBuffer = await blob.arrayBuffer();
        const { key } = page.Parameters;
        return GetTypedData(await DecryptAES(new Uint8Array(arrayBuffer, 12), GetBytesFromBase64(key), { name: 'AES-GCM', iv: new Uint8Array(arrayBuffer, 0, 12), tagLength: 128 }));
    }
}