import { Tags } from '../Tags';
import icon from './FeelWeb.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/#label', 'li.series-item a', anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h4').textContent.trim() }))
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('feelweb', 'FeelWeb', 'https://feelweb.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}