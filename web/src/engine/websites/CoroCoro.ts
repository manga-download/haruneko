import { Tags } from '../Tags';
import icon from './CoroCoro.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

function MangaExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector('div.p-article-image img').getAttribute('alt').trim()
    };
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePageCSS('/manga', 'ul.p-list-manga li.p-wp-list-item a.p-article-wrap', MangaExtractor)
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('corocoro', `CoroCoro Online (コロコロオンライン)`, 'https://www.corocoro.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}
