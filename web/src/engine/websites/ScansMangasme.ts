import { Tags } from '../Tags';
import icon from './ScansMangasme.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/scansmangas\.me\/manga\/[^/]+\/$/, 'div.bigcontent div.infox h1')
@MangaStream.MangasSinglePageCSS('div.jdlbar ul li a.series', '/tous-nos-mangas/?list')
@MangaStream.ChaptersSinglePageCSS('span.lchx.desktop > a')
@Common.PagesSinglePageJS('pages.map(page => page.page_image);', 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scansmangasme', 'ScansMangas (ME)', 'https://scansmangas.me', Tags.Media.Manga, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}