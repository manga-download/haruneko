import { Tags } from '../../Tags';
import icon from './HenChan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/x\.henchan\.pro\/manga\//, 'div#info_wrap div.name_row h1 a.title_top_a')
@Common.MangasMultiPageCSS('/manga/new?offset={page}', 'div#content div.content_row div.manga_row1 h2 a.title_link', 0, 20, 0)
@Common.ChaptersSinglePageCSS('div#manga_images a')
@Common.PagesSinglePageJS('data.fullimg', 500)
@Common.ImageAjax(true)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('henchan', `Хентай-тян! (Hentai-chan)`, 'https://x.henchan.pro', Tags.Language.Russian, Tags.Source.Aggregator, Tags.Rating.Pornographic, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}