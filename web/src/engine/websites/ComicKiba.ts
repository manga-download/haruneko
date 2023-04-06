import { Tags } from '../Tags';
import icon from './ComicKiba.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/comickiba\.com\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="comickiba"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.page-break img, li.blocks-gallery-item img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comickiba', 'Comic Kiba', 'https://comickiba.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}