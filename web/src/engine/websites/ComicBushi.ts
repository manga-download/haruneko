import { Tags } from '../Tags';
import icon from './ComicBushi.webp';
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
@Common.MangasSinglePageCSS('/', 'section#lineup ul.lineup-list div.lineup-item a', MangaExtractor)
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicbushi', `コミックブシロードWEB (Comic Bushiroad WEB)`, 'https://comicbushi-web.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }
    public override get Icon() {
        return icon;
    }
}