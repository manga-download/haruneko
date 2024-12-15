import { Tags } from '../Tags';
import icon from './MangaReader.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'table tr td span.name')
@Common.MangasSinglePagesCSS([ '/alphabetical' ], 'ul.d46 li a')
@Common.ChaptersSinglePageCSS('table tbody tr td:first-of-type a')
@Common.PagesSinglePageCSS('img[data-id].img-loading')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangareader', `MangaReader`, 'https://mangareader.tv', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}