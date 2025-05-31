import { Tags } from '../Tags';
import icon from './ColaManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

import { DRMProvider } from './ColaManga.DRM.js';

type PageParameters = {
    key?: string;
};

@Common.MangaCSS(/^{origin}\/manga-[^/]+\//, 'dl.fed-deta-info dd.fed-deta-content h1.fed-part-eone')
@Common.MangasMultiPageCSS('/show?page={page}', 'ul.fed-list-info li.fed-list-item a.fed-list-title')
@Common.ChaptersSinglePageCSS('div.all_data_list ul li a')
export default class extends DecoratableMangaScraper {

    #drm: DRMProvider = new DRMProvider();

    public constructor() {
        super('colamanga', 'Coco漫画', 'https://www.colamanga.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon(): string {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const images = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return images.map(image => new Page<PageParameters>(this, chapter, new URL(image.url, this.URI), { key: image.key }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link, {
                headers: {
                    Referer: this.URI.href,
                    Origin: this.URI.origin,
                }
            });

            const response = await Fetch(request);

            if(page.Parameters.key) {
                const decrypted = await this.#drm.DecryptImage(await response.arrayBuffer(), page.Parameters.key);
                return Common.GetTypedData(decrypted);
            } else {
                return response.blob();
            }
        }, priority, signal);
    }
}