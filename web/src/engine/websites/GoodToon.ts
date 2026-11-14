import { Tags } from '../Tags';
import icon from './GoodToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX('a.card')
@Madara.ChaptersSinglePageAJAXv2(undefined, Common.AnchorInfoExtractor(false, 'span'))
@Madara.PagesSinglePageCSS('img.wp-manga-chapter-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('goodtoon', 'GoodToon', 'https://www.goodtoon011.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator, Tags.Language.Korean);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}