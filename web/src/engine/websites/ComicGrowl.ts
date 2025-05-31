import { Tags } from '../Tags';
import icon from './ComicGrowl.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('h5.title').textContent.replace(/^完結 /, '').trim()
    };
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePagesCSS([ '/' ], 'section#lineup ul.lineup-list div.lineup-item a', MangaExtractor)
@CoreView.ChaptersMultiPagesAJAXV1()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicgrowl', `コミックグロウル (Comic Growl)`, 'https://comic-growl.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }
    public override get Icon() {
        return icon;
    }
}