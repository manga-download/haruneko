import { Tags } from '../Tags';
import icon from './PatyScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FoolSlide from './decorators/FoolSlide';

@FoolSlide.MangaCSS(/^https?:\/\/lector\.patyscans\.com/)
@FoolSlide.MangasMultiPageCSS()
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX(/"pages":(\[[\S\W]+\]),/)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('patyscans', `PatyScans`, 'https://lector.patyscans.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}