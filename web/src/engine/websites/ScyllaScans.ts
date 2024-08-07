import { Tags } from '../Tags';
import icon from './ScyllaScans.webp';
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
        super('scyllascans', `Scylla Scans`, 'https://scyllacomics.xyz', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}