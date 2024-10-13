// Related Websites: ReadManga, Usagi
import { Tags } from '../Tags';
import icon from './Usagi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}/, '#mangaBox meta[itemprop="name"]')
@Common.MangasMultiPageCSS('/list?offset={page}', 'div.tile div.desc h3 a', 0, 50, 0)
@Common.ChaptersSinglePageCSS('tr.item-row a.chapter-link')
@Common.PagesSinglePageJS(`rm_h.pics.map(pic => pic.url);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('usagi', 'Usagi', 'https://web.usagi.one', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}