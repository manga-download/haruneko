import { Tags } from '../Tags';
import icon from './BookLive.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
function ChapterExtractor(element: HTMLElement) {
    const linkElement = element.querySelector<HTMLAnchorElement>('a.bl-bviewer');
    const id = '/bviewer/s/?cid=' + linkElement.dataset.title + '_' + linkElement.dataset.vol;
    const title = element.querySelector<HTMLAnchorElement>('a.cart_action').dataset.vol.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/product\/index\/title_id\/\d+\/vol_no\/\d+$/, 'li.contents span.book_title')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageCSS('div#slide_up_top li.item div.buttons', ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('booklive', `BookLive`, 'https://booklive.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}