import { Tags } from '../Tags';
import icon from './MaviManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\//, 'span.mangasc-title')
@Common.MangasMultiPageCSS('/manga-listesi/sayfa/{page}/', 'ul.manga-list li a')
@Common.ChaptersSinglePageCSS('div.mangaep-list tbody tr td:first-of-type a')
@Common.PagesSinglePageCSS('div.viewer-cnt div#all img.img-responsive')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mavimanga', `Mavi Manga`, 'https://mavimanga.com', Tags.Language.Turkish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}