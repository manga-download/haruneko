import { Tags } from '../Tags';
import icon from './KomikIndoId.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('.daftarkartun #abtext .jdlbar ul li a', '/daftar-manga/?list')
@MangaStream.ChaptersSinglePageCSS('div#chapter_list span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div.chapter-area div.chapter-image div#chimg-auh img[src]:not([src=""])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindoid', 'KomikIndoId', 'https://komikindo.tv', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}