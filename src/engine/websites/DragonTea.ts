import { Tags } from '../Tags';
import icon from './DragonTea.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/novel\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dragontea', 'Dragon Tea Scans', 'https://dragontea.ink', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}