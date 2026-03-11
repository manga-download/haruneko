import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './ComicZenon.webp';
import * as Common from './decorators/Common';
import * as CoreView from './decorators/CoreView';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS('div.serial-contents section div.series-item h4 > a', Common.StaticLinkGenerator('/series/zenon', '/series/zenyon', '/series/tatan', '/series/oneshot'), 0, CoreView.DefaultMangaExtractor)
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comiczenon', 'ゼノン編集部 (Comic Zenon)', 'https://comic-zenon.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}