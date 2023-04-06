import { Tags } from '../Tags';
import icon from './FirstKissManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/1stkissmanhua\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS('div.page-break noscript img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('1stkissmanhua', '1st Kiss Manhua', 'https://1stkissmanhua.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}