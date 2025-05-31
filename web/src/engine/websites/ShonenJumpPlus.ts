import { Tags } from '../Tags';
import icon from './ShonenJumpPlus.webp';
import { type Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/(episode|magazine|volume)\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePagesCSS(['/series', '/series/oneshot', '/series/finished'], 'article.series-list-wrapper ul.series-list > li.series-list-item > a', CoreView.DefaultMangaExtractor)
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenjumpplus', `少年ジャンプ＋ (Shonen Jump +)`, 'https://shonenjumpplus.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (/^\/magazine\/\d+$/.test(manga.Identifier)) {
            return CoreView.FetchChaptersMultiPagesAJAXV1.call(this, manga);
        } else {
            return CoreView.FetchChaptersMultiPagesAJAXV2.call(this, manga);
        }
    }
}