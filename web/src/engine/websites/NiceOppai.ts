import { Tags } from '../Tags';
import icon from './NiceOppai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('alt').split(' - ')[0].trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'div.wpm_pag h1.ttl')
@Common.MangasMultiPageCSS('div.lst_ara div.cvr a', Common.PatternLinkGenerator('/manga_list/all/any/name-az/{page}/'), 0, MangaInfoExtractor)
@Common.ChaptersMultiPageCSS('ul.lst li.lng_ a.lst', 1, 1, 0,
    Common.PatternLinkResolver('{id}chapter-list/{page}/'),
    Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#image-container img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('niceoppai', 'NiceOppai', 'https://www.niceoppai.net', Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}