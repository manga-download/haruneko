import { Tags } from '../Tags';
import icon from './KurageBunch.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS<HTMLAnchorElement>('ul.page-series-list li.page-series-list-item div.series-data a.series-data-container', Common.StaticLinkGenerator('/series/kuragebunch', '/series/comicbunch', '/series/bbunch', '/series/ututu', '/series/oneshot'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h4').textContent.trim() }))
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuragebunch', `くらげバンチ (KurageBunch)`, 'https://kuragebunch.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}