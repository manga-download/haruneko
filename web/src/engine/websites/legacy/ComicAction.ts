import { Tags } from '../../Tags';
import icon from './ComicAction.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as CoreView from '../decorators/CoreView';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/comic-action\.com\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series', '/series/oneshot', '/series/yoru-sunday'], 'section.series ul.series-series-list > li.series-series-item', 'a')
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageDescrambler()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicaction', `webアクション (Comic Action)`, 'https://comic-action.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}