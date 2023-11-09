import { Tags } from '../Tags';
import icon from './AllHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReadM from './decorators/ReadMangaLive';

@Common.MangaCSS(/^https?:\/\/20\.allhen\.online\/[^/]+$/, ReadM.queryMangaTitle)
@Common.MangasMultiPageCSS(ReadM.pathMangas, ReadM.queryMangas, 0, ReadM.pageMangaOffset, 1000, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(ReadM.queryChapters)
@ReadM.PagesSinglePageJS()
@ReadM.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('allhentai', `AllHentai`, 'https://20.allhen.online/', Tags.Language.Russian, Tags.Media.Manga, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}