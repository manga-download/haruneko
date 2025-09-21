import { Tags } from '../Tags';
import icon from './KomikLovers.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/)
@Common.MangasMultiPageCSS('div.bs div.bsx a', Common.PatternLinkGenerator('/projects/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiklovers', 'KomiLovers', 'https://komiklovers.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}