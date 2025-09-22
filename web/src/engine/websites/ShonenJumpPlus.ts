import { Tags } from '../Tags';
import icon from './ShonenJumpPlus.webp';
import { type Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/(episode|magazine|volume)\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS('article.series-list-wrapper ul.series-list > li.series-list-item > a', Common.StaticLinkGenerator('/series', '/series/oneshot', '/series/finished'), 0, CoreView.DefaultMangaExtractor)
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenjumpplus', '少年ジャンプ＋ (Shonen Jump +)', 'https://shonenjumpplus.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (/^\/magazine\/\d+$/.test(manga.Identifier)) { //avoid a server error specific to this website.
            return CoreView.FetchChaptersMultiPageAJAXV2.call(this, manga, ['magazine'] );
        } else {
            return CoreView.FetchChaptersMultiPageAJAXV2.call(this, manga, ['episode', 'volume']);
        }
    }
}