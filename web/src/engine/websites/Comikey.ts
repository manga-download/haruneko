import { Tags } from '../Tags';
import icon from './Comikey.webp';
import { Fetch } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

import { DRMProvider } from './Comikey.DRM';

type PageData = {
    /**
     * A set of responsive images for the page (ordered by quality ➔ resolution + type)
     */
    srcset: string[],
}

@Common.MangaCSS(/^https?:\/\/comikey\.com\/comics\/[^/]+\/\d+\/$/, 'div.series-info span.title')
@Common.MangasMultiPageCSS('/comics/ajax?order=name&page={page}', '[data-view="list"] ul li > div.series-data span.title a')
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor() {
        super('comikey', 'Comikey', 'https://comikey.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Official);
    }

    public override get Icon(): string {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await this.#drm.CreateChapterList(new URL(manga.Identifier, this.URI));
        return data.map(chapter => new Chapter(this, manga, chapter.id, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const data = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        if(data) {
            return data.map(({ srcset }) => new Page(this, chapter, new URL(srcset.shift()), { srcset }));
        } else {
            console.warn(`[${this.Identifier}] Failed to load images directly from official website (DRM protection may have been updated)!`);
            // TODO: localize ...
            throw new Error('There was no content found for the selected chapter, make sure it is accessible (login, purchase, ...)!');
        }
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            for (const url of [ page.Link.href, ...page.Parameters.srcset ]) {
                try {
                    const request = new Request(new URL(url), { signal: signal, headers: { Referer: this.URI.href } });
                    const response = await Fetch(request);
                    if (response.headers.get('Content-Type').startsWith('image/')) {
                        return response.blob();
                    }
                } catch {}
            }
        }, priority, signal);
    }
}