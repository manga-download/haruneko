import { Tags } from '../Tags';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import icon from './LoversToon.webp';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import { GetBytesFromBase64 } from '../BufferEncoder';

type PagesData = {
    url: string
};

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
        const gateUrl = (await FetchCSS<HTMLAnchorElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.reading-content div.page-break a')).at(0);
        const { url } = JSON.parse(new TextDecoder().decode(GetBytesFromBase64(new URL(gateUrl.href).searchParams.get('auth')))) as PagesData;
        return url.split(';').map(image => new Page(this, chapter, new URL(image)));
    }
}