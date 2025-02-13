import { Tags } from '../Tags';
import icon from './RealmOasis.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/\d+\/[^/]+$/)
@Common.MangasSinglePagesCSS(['/series'], 'div.bsx a', Common.AnchorInfoExtractor(true))
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS([/ramrvsrc\d+\.webp$/, /66c47bc2c15dd\.webp/])
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('realmoasis', 'Realm Oasis', 'https://realmoasis.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}