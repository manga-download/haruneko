import { Tags } from '../Tags';
import icon from './NovaFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/seri\/[^/]+\/$/, 'h1.series-title')
@Common.MangasMultiPageCSS('div.nova-manga-grid article div.nova-info h3 a', Common.PatternLinkGenerator('/page/{page}/'))
@Common.ChaptersSinglePageCSS('a.chapter-box', undefined, Common.AnchorInfoExtractor(false, 'span:not(.ch-name)'))
@Common.PagesSinglePageCSS('div.webtoon-images img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novafansub', 'Nova Fansub', 'https://novafansub2.site', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}