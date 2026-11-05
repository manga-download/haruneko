import { Tags } from '../Tags';
import icon from './XlecX.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+-[^/]+\.html/, 'meta[name="description"]')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('main section.sect div#dle-content > a.thumb', Common.PatternLinkGenerator('/page/{page}/'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h3.thumb__title ').textContent.trim() }))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.imagegall23 img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xlecx', 'XlecX', 'https://xlecx.one', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Comic, Tags.Media.Manga, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}