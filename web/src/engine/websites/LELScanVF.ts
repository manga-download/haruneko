import { Tags } from '../Tags';
import icon from './LELScanVF.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FuzzyDoodle from './decorators/FuzzyDoodle';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, FuzzyDoodle.queryMangatitle, FuzzyDoodle.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FuzzyDoodle.mangaPath, FuzzyDoodle.queryMangas, 1, 1, 0, FuzzyDoodle.MangaInfoExtractor)
@FuzzyDoodle.ChaptersMultiPageCSS()
@Common.PagesSinglePageCSS(FuzzyDoodle.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelscanvf', `LELSCAN-VF`, 'https://lelscanfr.com', Tags.Language.French, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
