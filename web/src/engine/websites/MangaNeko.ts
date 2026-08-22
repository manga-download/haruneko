import { Tags } from '../Tags';
import icon from './MangaNeko.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/(?!manga(?:\/|$)|genres\/|bookmark\/)[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/manga/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS(`[
    ...document.querySelectorAll('#readerarea img, .reading-content img')
].map(image => image.dataset.src || image.dataset.lazySrc || image.src).filter(link => link && !link.startsWith('data:'))`, 1500)
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('manganeko', 'Manga-Neko', 'https://manga-neko.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const image = new Page(this, page.Parent as Chapter, page.Link, { Referer: this.URI.href });
        const data = await Common.FetchImageElement.call(this, image, priority, signal, true, true);
        if (data.type.startsWith('image/')) return data;

        for (let attempt = 0; attempt < 3; attempt++) {
            const dataURL = await FetchWindowScript<string>(new Request(page.Link, { signal }), `new Promise((resolve, reject) => {
                fetch(location.href, { cache: 'reload' }).then(response => response.blob()).then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(reader.error?.message || 'Failed to read image data');
                    reader.readAsDataURL(blob);
                }).catch(error => reject(error.message));
            })`, 2500);
            if (!dataURL.startsWith('data:image/')) continue;
            const [metadata, encoded] = dataURL.split(',');
            const type = metadata.match(/^data:([^;]+)/)?.at(1) || 'application/octet-stream';
            const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
            return new Blob([bytes], { type });
        }
        throw new Error(`Failed to fetch image data from ${page.Link.href}`);
    }
}
