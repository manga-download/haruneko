import { Tags } from '../Tags';
import icon from './MMScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.series-title')
@Madara.MangasMultiPageAJAX('div.item-summary a')
@Madara.ChaptersSinglePageCSS('ul.chapter-ul li a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mmscans', 'MMSCANS', 'https://mm-scans.org', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}