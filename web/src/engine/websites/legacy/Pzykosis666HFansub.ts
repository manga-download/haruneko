import { Tags } from '../../Tags';
import icon from './Pzykosis666HFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as FoolSlide from '../decorators/FoolSlide';
import * as Common from '../decorators/Common';

@FoolSlide.MangaCSS(/^https?:\/\/pzykosis666hfansub.com\/online\/series\/[^/]+\/?$/, 'div.comic .title' )
@FoolSlide.MangasMultiPageCSS('/online/directory/{page}/')
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pzykosis666hfansub', `Pzykosis666HFansub`, 'https://pzykosis666hfansub.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}