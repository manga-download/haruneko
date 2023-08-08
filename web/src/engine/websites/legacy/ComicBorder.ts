import { Tags } from '../../Tags';
import icon from './ComicBorder.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as CoreView from '../decorators/CoreView';
import * as Common from '../decorators/Common';
function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.lastChild.textContent.trim()
    };
}

@Common.MangaCSS(/^https?:\/\/comicborder\.com\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePageCSS('/', 'ul.index-list-all li a', MangaExtractor)
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageDescrambler()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicborder', `コミックボーダー (ComicBorder)`, 'https://comicborder.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}