import { Tags } from '../Tags';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import icon from './LoversToon.webp';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRegex } from '../platform/FetchProvider';
import { GetBytesFromBase64 } from '../BufferEncoder';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
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
        const gateUrl = (await FetchCSS<HTMLAnchorElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.reading-content div.page-break a')).at(0).href;
        const [B64PagesData] = await FetchRegex(new Request(new URL(gateUrl)), /token\s*=\s*([^&]+)/g);
        return new TextDecoder().decode(GetBytesFromBase64(B64PagesData)).split(';').map(image => new Page(this, chapter, new URL(image)));
    }
}