import { Tags } from '../Tags';
import icon from './HentaiTokyo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.post-titulo')
@Common.MangasMultiPageCSS('div.container > div.lista ul li a[href^="https://hentaitokyo.net"]', Common.PatternLinkGenerator('/page/{page}/'))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('ul.post-fotos li img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaitokyo', 'Hentai Tokyo', 'https://hentaitokyo.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}