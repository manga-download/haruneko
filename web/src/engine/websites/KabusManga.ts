import { Tags } from '../Tags';
import icon from './KabusManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX('div.post-title a:last-of-type')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.page-break img[data-src]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kabusmanga', 'Kabus Manga', 'https://kabusmanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}