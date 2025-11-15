import { Tags } from '../Tags';
import icon from './MenudoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FoolSlide from './decorators/FoolSlide';

@FoolSlide.MangaCSS(/^{origin}\/slide\/series\/[^/]+\/$/)
@FoolSlide.MangasMultiPageCSS('/slide/directory/')
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('menudofansub', `MenudoFansub`, 'https://www.menudo-fansub.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}