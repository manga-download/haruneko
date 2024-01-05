import { Tags } from '../Tags';
import icon from './NoraNoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FoolSlide from './decorators/FoolSlide';

@FoolSlide.MangaCSS(/^https?:\/\/www\.noranofansub\.com\/lector\/series\/[^/]+\/$/)
@FoolSlide.MangasMultiPageCSS('/lector/directory/{page}')
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('noranofansub', `NoraNoFansub`, 'https://www.noranofansub.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}