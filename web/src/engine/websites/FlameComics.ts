import { Tags } from '../Tags';
import icon from './FlameComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/flamecomics\.com\/series\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.postbody div.soralist ul li a.series', '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('flamecomics', 'Flame Comics', 'https://flamecomics.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}