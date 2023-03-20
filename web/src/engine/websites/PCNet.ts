import { Tags } from '../Tags';
import icon from './PCNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FoolSlide from './decorators/FoolSlide';

@FoolSlide.MangaCSS(/^http?:\/\/pcnet\.patyscans\.com\/series\//)
@FoolSlide.MangasMultiPageCSS()
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pcnet', `PCNet`, 'http://pcnet.patyscans.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
