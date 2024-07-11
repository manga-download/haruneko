import { Tags } from '../Tags';
import icon from './MangaRawAC.webp';
import * as Common from './decorators/Common';
import SpoilerPlus, { MangaInfoExtractor, MangaLabelExtractor } from './SpoilerPlus';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+-raw-free\/$/, 'h1.padding-title', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/page/{page}/', 'div.pa-list-item div.pa-text a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('ul.basic-list li a.ch-name')

export default class extends SpoilerPlus {

    public constructor() {
        super('mangarawac', 'MangaRawAC', 'https://mangaraw.ac', 'div.chapter-comic div[data-z]', [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked]);
    }

    public override get Icon() {
        return icon;
    }
}
