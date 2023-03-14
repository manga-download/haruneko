import { Tags } from '../Tags';
import icon from './FirstKissManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/1stkissmanga\.me\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS('div.page-break noscript img')
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('firstkiss', '1st Kiss Manga', 'https://1stkissmanga.me', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
