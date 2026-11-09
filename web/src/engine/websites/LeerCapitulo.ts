import { Tags } from '../Tags';
import icon from './LeerCapitulo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('a.lc-card-name', Common.PatternLinkGenerator('/manga/?page={page}'))
@Common.ChaptersSinglePageCSS('div#chapterList a.lc-chapter-row', undefined, Common.AnchorInfoExtractor(false, 'span:not(.n)'))
@Common.PagesSinglePageCSS('main#lcPages img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leercapitulo', 'LeerCapitulo', 'https://www.leercapitulo.co', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}