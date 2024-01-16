import { Tags } from '../Tags';
import icon from './WantedTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FoolSlide from './decorators/FoolSlide';

@FoolSlide.MangaCSS(/^https?:\/\/reader\.onepiecenakama\.pl\/series/, 'div.large h1.title')
@FoolSlide.MangasMultiPageCSS()
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wantedteam', `Wanted Team`, 'http://reader.onepiecenakama.pl', Tags.Language.Polish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}