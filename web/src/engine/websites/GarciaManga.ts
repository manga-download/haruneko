import { Tags } from '../Tags';
import icon from './GarciaManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageCSS('div.reading-content div.separator a img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('garciamanga', 'Garcia Manga', 'https://garciamanga.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Source.Aggregator, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}