import { Tags } from '../../Tags';
import icon from './ComicZenon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as CoreView from '../decorators/CoreView';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/comic-zenon\.com\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series/zenon', '/series/zenyon', '/series/tatan', '/series/oneshot'], 'div.serial-contents section div.series-item h4 > a', null, null)
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageDescrambler()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comiczenon', `ゼノン編集部 (Comic Zenon)`, 'https://comic-zenon.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}
