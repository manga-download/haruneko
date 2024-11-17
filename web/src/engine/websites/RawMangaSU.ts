import { Tags } from '../Tags';
import icon from './RawMangaSU.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/r\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.mg-list div.mg-item img')
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawmangasu', 'RawManga (.su)', 'https://rawmanga.su', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}