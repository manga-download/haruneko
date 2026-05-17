import { Tags } from '../Tags';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import icon from './LoversToon.webp';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('loverstoon', 'Lovers Toon', 'https://loverstoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [pages] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /content:\s*(\[[^\]]*\])/gm);
        return (JSON.parse(pages) as string[]).map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }
}