import { type Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import * as Common from './decorators/Common';
import * as CoreView from './decorators/CoreView';
import icon from './ShonenJumpPlus.webp';

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
        return CoreView.FetchChaptersMultiPageAJAXV2.call(this, manga, .../^\/magazine\/\d+$/.test(manga.Identifier) ? ['magazine'] : []);
    }
}