import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import * as Common from './decorators/Common';
import { FlatManga, MangaLabelExtractor, ChapterScript, PageScript, queryMangaTitle } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/(mgraw-)?\d+\/$/, queryMangaTitle, MangaLabelExtractor)
@Common.ChaptersSinglePageJS(ChapterScript(), 1500)
@Common.PagesSinglePageJS(PageScript(), 1500)
export default class extends FlatManga {
    public constructor() {
        super('welovemanga', 'WeloveManga', 'https://welovemanga.one', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}