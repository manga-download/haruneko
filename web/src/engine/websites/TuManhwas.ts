import { Tags } from '../Tags';
import icon from './TuManhwas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.entry-title')
@Common.MangasMultiPageCSS('/biblioteca?page={page}', 'div.bs div.bsx a', 1, 1, 1000)
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li a')
@Common.PagesSinglePageCSS('div#chapter_imgs img')
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumanhwas', 'TuManhwas', 'https://tumanhwas.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}