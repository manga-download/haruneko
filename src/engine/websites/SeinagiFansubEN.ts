import { Tags } from '../Tags';
import icon from './SeinagiFansubEN.webp';
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
        super('seinagifansub-en', `SeinagiFansub (EN)`, 'https://reader.seinagi.org.es', Tags.Language.English, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}