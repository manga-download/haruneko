import { Tags } from '../Tags';
import icon from './SeinagiAdultoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as FoolSlide from './decorators/FoolSlide';
import * as Common from './decorators/Common';

@FoolSlide.MangaCSS(/^{origin}\/series\/[^/]+\/?$/, 'div.comic h1.title')
@FoolSlide.MangasMultiPageCSS()
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('seinagiadultofansub', `SeinagiAdultoFansub`, 'https://adulto.seinagi.org.es', Tags.Language.Spanish, Tags.Media.Manga, Tags.Rating.Erotica, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}