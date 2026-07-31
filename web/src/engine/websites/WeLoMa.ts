import { Tags } from '../Tags';
import icon from './WeLoMa.webp';
import * as Common from './decorators/Common';
import { queryMangaTitle, ClipBoardExtractor, queryChapters, queryPages, FlatManga } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/m\/[^/]+$/, queryMangaTitle, ClipBoardExtractor)
@Common.ChaptersSinglePageCSS(queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS<HTMLImageElement>(queryPages, img => window.atob(img.dataset.img))
export default class extends FlatManga {

    public constructor() {
        super('weloma', 'WeLoMa', 'https://weloma.net', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}