import { Tags } from '../Tags';
import icon from './RaijinScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

import { DRMProvider } from './RaijinScans.DRM';
import { FetchWindowScript } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.serie-info h1.serie-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor() {
        super('raijinscans', 'RaijinScans', 'https://raijin-scans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('manga/-/', this.URI)), '');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await this.#drm.CreatePageLinks(new URL(chapter.Identifier, this.URI));
        return data.map(link => new Page(this, chapter, new URL(link, this.URI)));
    }
}
