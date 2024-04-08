import { Tags } from '../Tags';
import icon from './FleksyScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FuzzyDoodle from './decorators/FuzzyDoodle';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, FuzzyDoodle.queryMangatitle, FuzzyDoodle.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FuzzyDoodle.mangaPath, FuzzyDoodle.queryMangas, 1, 1, 0, FuzzyDoodle.MangaInfoExtractor)
@Common.ChaptersSinglePageCSS(FuzzyDoodle.queryChapters, FuzzyDoodle.ChapterExtractor)
@Common.PagesSinglePageCSS(FuzzyDoodle.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fleksyscans', `Fleksy Scans`, 'https://flexscans.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}