import { Tags } from '../Tags';
import icon from './Manga18FX.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.post-title')
@Madara.MangasMultiPageCSS('div.bixbox div.listupd div.bigor-manga h3 a', 0, '/page/{page}')
@Madara.ChaptersSinglePageCSS('div#chapterlist ul li a.chapter-name')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga18fx', 'Manga18fx', 'https://manga18fx.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}
