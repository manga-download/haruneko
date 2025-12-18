import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './TuMangaOnline.webp';
import * as Common from './decorators/Common';

import { DRMProvider } from './TuMangaOnline.DRM.js';

function ChapterInfoExtractor(element: HTMLAnchorElement) {
    const row = element.closest<HTMLUListElement>('li.list-group-item');
    const language = row?.querySelector('i.flag-icon')?.className?.match(/flag-icon-([a-z]+)/)?.pop()?.trim();
    const scanlator = row?.querySelector<HTMLAnchorElement>('a[href*="/groups/"]')?.innerText?.trim();
    const title = row?.closest<HTMLUListElement>('li.upload-link')?.querySelector<HTMLHeadingElement>('h4')?.innerText.trim();
    return {
        id: element.pathname,
        title: [
            title,
            scanlator ? `[${scanlator}]` : undefined,
            language ? `(${language})` : undefined,
        ].filter(entry => entry).join(' '),
    };
}

@Common.MangaCSS(/^{origin}\/library\/[^/]+\/\d+\/[^/]+$/, 'section.element-header-content h2.element-subtitle')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageCSS('ul.chapter-list a[href*="/view_uploads/"]', undefined, ChapterInfoExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    #drm: DRMProvider = new DRMProvider();

    public constructor() {
        super('tumangaonline', `TuMangaOnline`, 'https://zonatmo.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon(): string {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { links, viewerUrl } = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return links.map(image => new Page(this, chapter, new URL(image), { Referer: viewerUrl }));
    }
}