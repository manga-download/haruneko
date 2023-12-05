import { Tags } from '../Tags';
import icon from './HadesNoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Hades No Fansub"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hadesnofansub', 'Hades No Fansub', 'https://hadesnofansub.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}