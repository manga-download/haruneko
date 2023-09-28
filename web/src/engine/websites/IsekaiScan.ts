import { Tags } from '../Tags';
import icon from './IsekaiScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/m\.isekaiscan\.to\/mangax\/[^/]+\/$/)
@Madara.MangasMultiPageCSS('div.post-title p.juduldepan a')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('isekaiscan', 'Isekai Scan', 'https://m.isekaiscan.to', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}