import { Tags } from '../Tags';
import icon from './LeerManhwas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+\/$/, 'h1.main-info-title')
@Common.MangasMultiPageCSS('div.latest-item div.mm-name a', Common.PatternLinkGenerator('/page/{page}/'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('ul.chapter-list a.leermos', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('.chapter-name').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.reading-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leermanhwas', 'LeerManhwas', 'https://leermanhwas.com', Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
