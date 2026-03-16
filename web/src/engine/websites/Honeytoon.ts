import { Tags } from '../Tags';
import icon from './Honeytoon.webp';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';
import type { Priority } from '../taskpool/DeferredTask';

type PageData = {
    scrambled: boolean;
};

const chapterLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['fr', Tags.Language.French],
    ['de', Tags.Language.German],
    ['it', Tags.Language.Italian],
    ['pt', Tags.Language.Portuguese],
    ['es', Tags.Language.Spanish],
]);

function ApplyLanguage(title: string, path: string): string {
    const lang = ExtractLanguage(path);
    return [title.trim(), `(${lang})`].join(' ').trim();
}

function ExtractLanguage(path: string): string {
    return path.match(/^\/([^/]+)\/comic/)?.at(1) ?? 'en';
}

@Common.MangaCSS(/^{origin}\/([^/]+\/)?comic\/[^/]+$/, 'h1.comic-book__title', (element, uri) => ({ id: uri.pathname, title: ApplyLanguage(element.textContent, uri.pathname) }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.preview-card__link',
    Common.StaticLinkGenerator(...['', '/fr', '/de', '/es', '/it', '/pt'].map(el => `${el}/genres`)), 0,
    anchor => ({
        id: anchor.pathname,
        title: ApplyLanguage(anchor.querySelector('.preview-card__title').textContent.trim(), anchor.pathname)
    }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('honeytoon', 'Honeytoon', 'https://honeytoon.com', Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('eighteen', '1')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'a.comic-list__item[href*="/comic/"]');
        return elements.map(anchor => {
            const languageCode = ExtractLanguage(anchor.pathname);
            return new Chapter(this, manga, anchor.pathname, anchor.querySelector('.comic-list__title-desc').textContent.replace(/[\r\n]+/g, '').replace(/\s{2,}/g, ' ').trim(),
                ...chapterLanguageMap.has(languageCode) ? [chapterLanguageMap.get(languageCode)] : []
            );
        });
    }

    public async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const pages = await FetchCSS<HTMLImageElement | HTMLCanvasElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.single__item img, div.single__item canvas');
        return pages.map(page => {
            const scrambled = page instanceof HTMLCanvasElement;
            return new Page<PageData>(this, chapter, scrambled ? new URL(`./api/common/resource/sync?t=${encodeURIComponent(page.dataset.token)}`, this.URI) : new URL(page.dataset.src ?? page.src), { scrambled });
        });
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters.scrambled) return Common.FetchImageAjax.call(this, page, priority, signal);
        return this.imageTaskPool.Add(async () => {

            const response = await Fetch(new Request(page.Link));
            const scrambleData = response.headers.get('X-Part-Sizes').split(',').map(value => parseInt(value, 10));
            const buffer = await response.arrayBuffer();

            const blobs: Blob[] = [];
            let position = 0;

            for (const partSize of scrambleData) {
                const part = buffer.slice(position, position + partSize);
                blobs.push(new Blob([part], { type: 'image/webp' }));
                position += partSize;
            }

            const bitmaps: ImageBitmap[] = await Promise.all(
                blobs.map(blob => createImageBitmap(blob))
            );

            const totalHeight = bitmaps.reduce((sum, b) => sum + b.height, 0);

            return DeScramble(new ImageData(bitmaps[0].width, totalHeight), async (_, ctx) => {
                let currentY = 0;
                for (const bitmap of bitmaps) {
                    ctx.drawImage(bitmap, 0, currentY);
                    currentY += bitmap.height;
                    bitmap.close();
                }
            });
        }, priority, signal);
    }
}