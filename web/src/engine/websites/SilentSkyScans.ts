import { Tags } from '../Tags';
import icon from './SilentSkyScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FoolSlide from './decorators/FoolSlide';

@FoolSlide.MangaCSS(/^{origin}\/series\//, 'div.large h1.title')
@FoolSlide.MangasMultiPageCSS()
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('silentskyscans', `SilentSkyScans`, 'http://reader.silentsky-scans.net', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}