import { Tags } from '../../Tags';
import icon from './BookLive.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as SpeedBind from '../decorators/SpeedBind';
function ChapterExtractor(element: HTMLElement) {
    const id = '/bviewer/s/?cid=' + element.dataset.title + '_' + element.dataset.vol;
    const title = element.dataset.vol.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/booklive\.jp\/product\/index\/title_id\/\d+\/vol_no\/\d+$/, 'div#product_detail_area div.product_info > h1#product_display_1')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageCSS('div#product_detail_area div.product_actions ul a.bl-bviewer', ChapterExtractor)
@SpeedBind.PagesSinglePage()
@SpeedBind.ImageDescrambler()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('booklive', `BookLive`, 'https://booklive.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}