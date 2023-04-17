import { Tags } from '../Tags';
import icon from './TvYManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/tvymanga2\.com\//, 'main#main header.entry-header h1.entry-title')
@Common.MangasSinglePageCSS('/lista-de-mangas/', 'main#main div.entry-content ul li h4 a')
@Common.ChaptersSinglePageCSS('main#main div.entry-content ul.lcp_catlist li a')
@Common.PagesSinglePageCSS('main#main div.entry-content center img[decoding]')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tvymanga', `Tv y Manga`, 'https://tvymanga2.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}