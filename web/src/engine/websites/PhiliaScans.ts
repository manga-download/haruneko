import { Tags } from '../Tags';
import icon from './PhiliaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'div.serie-info h1.serie-title')
@Common.MangasMultiPageCSS('a.c-title', Common.PatternLinkGenerator('/all-mangas/page/{page}/'))
@Common.ChaptersSinglePageCSS('ul li[data-chapter] a:not([href="#"])', undefined, Common.AnchorInfoExtractor(false, 'span.coin'))
@Common.PagesSinglePageCSS('div#ch-images img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('philiascans', 'Philia Scans', 'https://philiascans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}