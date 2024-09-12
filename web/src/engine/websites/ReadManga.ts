// Related Websites: ReadManga, Usagi
import { Tags } from '../Tags';
import icon from './ReadManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https:\/\/(1|zz)\.readmanga\.io\/[^/]+$/, '#mangaBox meta[itemprop="name"]')
@Common.MangasMultiPageCSS('/list?offset={page}', 'div.tile div.desc h3 a', 0, 50, 0)
@Common.ChaptersSinglePageCSS('tr.item-row a.chapter-link') // TODO: Randomly redirects to Usagi
@Common.PagesSinglePageJS(`rm_h.pics.map(pic => pic.url);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readmanga', 'ReadManga', 'https://1.readmanga.io', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}