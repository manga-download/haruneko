import { Tags } from '../Tags';
import icon from './LilyumFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lilyumfansub', 'Lilyum Fansub', 'https://lilyumfansub.com.tr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Scanlator, Tags.Language.Turkish );
    }
    public override get Icon() {
        return icon;
    }
}
