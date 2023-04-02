import { Tags } from '../Tags';
import icon from './FuryoSquad.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/www\.furyosquad\.com\/[^/]+/, 'div.comic-info h1.fs-comic-title')
@Common.MangasSinglePageCSS('/mangas', 'div.fs-chap-container div.grid-item-container div.media-body a', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div.list.fs-chapter-list div.title a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.fs-reader-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('furyosquad', `Furyo Squad`, 'https://www.furyosquad.com', Tags.Language.French, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}