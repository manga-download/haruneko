import { Tags } from '../Tags';
import icon from './MangaWindow.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as AnyACG from './decorators/AnyACG';
import * as Common from './decorators/Common';

@AnyACG.MangaCSS(/^https?:\/\/mangawindow\.net\/series\/\d+(\/[^/]+)?$/, 'div.mainer div.title-set', 'h3.item-title', 'em.item-flag')
@AnyACG.MangasMultiPageCSS('/browse?page={page}', 'div.series-list div.item-text', 'a.item-title', 'em.item-flag')
@Common.ChaptersSinglePageCSS('div.episode-list div.main a.chapt')
@AnyACG.PagesSinglePageJS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangawindow', `MangaWindow (by AnyACG)`, 'https://mangawindow.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}