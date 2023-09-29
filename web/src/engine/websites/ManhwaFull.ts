import { Tags } from '../Tags';
import icon from './ManhwaFull.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwanew\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwafull', 'ManhwaFull', 'https://manhwanew.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}