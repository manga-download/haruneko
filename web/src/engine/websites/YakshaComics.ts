import { Tags } from '../Tags';
import icon from './YakshaComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yakshacomics', 'Yaksha Comics', 'https://yakshacomics.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}