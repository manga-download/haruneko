import { Tags } from '../Tags';
import icon from './RawFree.webp';
import { Zing92Base, MangaExtractor, ChapterExtractor } from './templates/Zing92Base';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS('div.entry-ma h2.ma-name a', Common.PatternLinkGenerator('/page/{page}/'), 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.entry-chapter a.stretched-link', undefined, ChapterExtractor)

export default class extends Zing92Base {

    public constructor() {
        super('rawfree', 'Raw FREE', 'https://rawfree.spot', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
        this.WithChapterParameterName('p');
    }

    public override get Icon() {
        return icon;
    }
}