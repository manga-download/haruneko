import { Tags } from '../Tags';
import icon from './AnataNoMotokare.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as FoolSlide from './decorators/FoolSlide';
import * as Common from './decorators/Common';

@FoolSlide.MangaCSS(/^https?:\/\/motokare.xyz\/reader\/series\/[^/]+\/?$/)
@FoolSlide.MangasMultiPageCSS('/reader/directory/{page}/')
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anatanomotokare', 'Anata no Motokare', 'https://motokare.xyz', Tags.Media.Manga, Tags.Source.Scanlator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}