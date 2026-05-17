import { Tags } from '../Tags';
import icon from './TaurusManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.post-title')
@Common.MangasMultiPageCSS('div.post-title h2 a', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersSinglePageCSS('li.wp-manga-chapter div.parm-extras > a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('taurusmanga', 'Taurus Manga', 'https://lectortaurus.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}