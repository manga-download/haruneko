import { Tags } from '../Tags';
import icon from './KomikIndoId.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/)
@Common.MangasMultiPageCSS('/daftar-manga/page/{page}/', 'div.film-list div.animposx div.bigors a')
@MangaStream.ChaptersSinglePageCSS('div#chapter_list span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div.chapter-area div.chapter-image div#chimg-auh img[src]:not([src=""])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindoid', 'KomikIndoId', 'https://komikindo.biz', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}