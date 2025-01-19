import { Tags } from '../Tags';
import icon from './RawInu.webp';
import * as Common from './decorators/Common';
import { FlatManga, MangaLabelExtractor, ChapterScript, PageScript } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, 'li.breadcrumb-item.active', MangaLabelExtractor)
@Common.ChaptersSinglePageJS(ChapterScript(), 1500)
@Common.PagesSinglePageJS(PageScript(), 1500)
export default class extends FlatManga {
    public constructor() {
        super('rawinu', 'RawInu', 'https://rawinu.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}