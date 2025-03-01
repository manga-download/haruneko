import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './MangaNelo.webp';
import * as Common from './decorators/Common';
import * as MangaNelBase from './decorators/MangaNelBase';

@MangaNelBase.MangaCSS(/^https?:\/\/(m\.|chap)manganelo\.com\/manga-[^/]+$/)
@Common.MangasMultiPageCSS('/genre-all/{page}', 'div.genres-item-info h3 a.genres-item-name', 1, 1, 0, MangaNelBase.AnchorInfoExtractor)
@Common.ChaptersSinglePageCSS(MangaNelBase.queryChapters, MangaNelBase.AnchorInfoExtractor)
@Common.PagesSinglePageCSS(MangaNelBase.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganelo', 'Manganelo', 'https://m.manganelo.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}